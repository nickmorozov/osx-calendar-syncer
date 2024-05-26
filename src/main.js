#!/usr/bin/env node

const { Worker } = require('worker_threads');
const { connectDB, closeDB } = require('./db');
const logger = require('./logger');
const config = require('./config');
const { syncItem } = require('./syncer');
require('dotenv').config();

const WORKER_COUNT = parseInt(process.env.WORKER_COUNT, 10) || 4; // Number of workers
const PERIOD_HOURS = parseInt(process.env.WORKER_HOURS, 10) || 6; // Each worker handles a 6-hour period

async function main() {
  logger.log('Starting syncer...');

  connectDB();

  // Calculate date range
  const startDate = new Date(Date.now() + config.dateRange.startOffset);
  const endDate = new Date(Date.now() + config.dateRange.endOffset);

  logger.log(`Calculated date range: ${startDate} to ${endDate}`);

  const workers = [];
  const results = [];

  for (let i = 0; i < WORKER_COUNT; i++) {
    workers.push({ isBusy: false });
  }

  const currentStartDate = new Date(startDate);

  function createWorker(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/finderWorker.js', {
        workerData: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      });

      worker.on('message', (message) => {
        if (message.error) {
          logger.error(`Error fetching period from ${message.startDate} to ${message.endDate}: ${message.error}`);
          reject(new Error(message.error));
        } else {
          logger.log(`Fetched period from ${message.startDate} to ${message.endDate}: ${message.events.length} events, ${message.reminders.length} reminders`);
          results.push(...message.events, ...message.reminders);
          resolve();
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async function processPeriods() {
    while (currentStartDate < endDate) {
      const worker = workers.find((w) => !w.isBusy);
      if (!worker) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for a worker to become available
        continue;
      }

      const nextStartDate = new Date(currentStartDate);
      const nextEndDate = new Date(nextStartDate);
      nextEndDate.setHours(nextEndDate.getHours() + PERIOD_HOURS);

      if (nextEndDate > endDate) {
        nextEndDate.setTime(endDate.getTime());
      }

      worker.isBusy = true;
      createWorker(nextStartDate, nextEndDate)
        .then(() => (worker.isBusy = false))
        .catch((err) => {
          logger.error(`Worker error: ${err.message}`);
          worker.isBusy = false;
        });

      currentStartDate.setHours(currentStartDate.getHours() + PERIOD_HOURS);
    }
  }

  await processPeriods();

  // Wait for all workers to finish
  await Promise.all(
    workers.map((worker) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!worker.isBusy) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    })
  );

  // Sync results
  for (const item of results) {
    try {
      const result = await syncItem(item, item.type);
      logger.log(`Synced item: ${result}`);
    } catch (err) {
      logger.error(`Error syncing item: ${err.message}`);
    }
  }

  closeDB();
  logger.log('Syncer finished.');

  // Ensure logs are flushed before exiting
  logger.end(() => {
    process.exit(0);
  });
}

if (require.main === module) {
  main()
    .then(() => logger.log('Syncer finished.'))
    .catch((reason) => {
      logger.error(`Error syncing item: ${reason}`);
    });
}

module.exports = main;
