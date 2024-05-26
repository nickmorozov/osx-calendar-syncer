#!/usr/bin/env node

const { connectDB, closeDB } = require('./db');
const { findEvents, findReminders } = require('./finder');
const { syncItem } = require('./syncer');
const config = require('./config');
const logger = require('./logger');

async function main() {
  logger.log('Starting syncer...');

  connectDB();

  // Calculate date range
  const startDate = new Date(Date.now() + config.dateRange.startOffset).toISOString().split('T')[0];
  const endDate = new Date(Date.now() + config.dateRange.endOffset).toISOString().split('T')[0];

  try {
    logger.log(`Fetching events and reminders from ${startDate} to ${endDate}...`);
    const events = await findEvents(startDate, endDate);
    const reminders = await findReminders(startDate, endDate);

    logger.log(`Found ${events.length} events and ${reminders.length} reminders.`);

    // Logic to sync events and reminders
    for (const event of events) {
      try {
        const result = await syncItem(event, 'event');
        logger.log(`Synced event: ${result}`);
      } catch (err) {
        logger.error(`Error syncing event: ${err.message}`);
      }
    }

    for (const reminder of reminders) {
      try {
        const result = await syncItem(reminder, 'reminder');
        logger.log(`Synced reminder: ${result}`);
      } catch (err) {
        logger.error(`Error syncing reminder: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Error during sync process: ${err.message}`);
  } finally {
    closeDB();
    logger.log('Syncer finished.');

    // Ensure logs are flushed before exiting
    logger.end(() => {
      process.exit(0);
    });
  }
}

main()
  .then(() => logger.log('Syncer exiting...'))
  .catch((reason) => logger.error(reason));
