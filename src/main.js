#!/usr/bin/env node

const { connectDB, closeDB } = require('./db');
const { findEvents, findReminders } = require('./finder');
const { syncItem } = require('./syncer');
const config = require('./config');
const fs = require('fs');
const process = require('process');
require('dotenv').config(); // Load environment variables

// Get log file name from environment variables
const logFileName = process.env.LOG_FILE || 'syncer.log';

// Redirect console output to log file
const logFile = fs.createWriteStream(logFileName, { flags: 'a' });
const logStdout = process.stdout;

console.log = function (message) {
  logFile.write(message + '\n');
  logStdout.write(message + '\n');
};

console.error = function (message) {
  logFile.write('ERROR: ' + message + '\n');
  logStdout.write('ERROR: ' + message + '\n');
};

async function main() {
  console.log('Starting syncer...');

  const db = connectDB();

  // Calculate date range
  const startDate = new Date(Date.now() + config.dateRange.startOffset).toISOString().split('T')[0];
  const endDate = new Date(Date.now() + config.dateRange.endOffset).toISOString().split('T')[0];

  try {
    console.log(`Fetching events and reminders from ${startDate} to ${endDate}...`);
    const events = await findEvents(startDate, endDate);
    const reminders = await findReminders(startDate, endDate);

    console.log(`Found ${events.length} events and ${reminders.length} reminders.`);

    for (const event of events) {
      try {
        const result = await syncItem(event, 'event');
        console.log(`Synced event: ${result}`);
      } catch (err) {
        console.error(`Error syncing event: ${err.message}`);
      }
    }

    for (const reminder of reminders) {
      try {
        const result = await syncItem(reminder, 'reminder');
        console.log(`Synced reminder: ${result}`);
      } catch (err) {
        console.error(`Error syncing reminder: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error during sync process: ${err.message}`);
  } finally {
    closeDB();
    console.log('Syncer finished.');

    // Ensure logs are flushed before exiting
    logFile.end(() => {
      process.exit(0);
    });
  }
}

main();
