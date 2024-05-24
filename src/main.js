#!/usr/bin/env node

const { fork } = require('child_process');
const { connectDB, closeDB } = require('./db');
const { findEvents, findReminders } = require('./finder');
const { syncItem } = require('./syncer');
const config = require('./config');

async function main() {
  const db = connectDB();

  // Calculate date range
  const startDate = new Date(Date.now() + config.dateRange.startOffset).toISOString().split('T')[0];
  const endDate = new Date(Date.now() + config.dateRange.endOffset).toISOString().split('T')[0];

  // Example of how to use the finder and syncer
  try {
    const events = await findEvents(startDate, endDate);
    const reminders = await findReminders(startDate, endDate);

    events.forEach(async (event) => {
      const result = await syncItem(event, 'event');
      console.log(`Synced event: ${result}`);
    });

    reminders.forEach(async (reminder) => {
      const result = await syncItem(reminder, 'reminder');
      console.log(`Synced reminder: ${result}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    closeDB();
  }
}

main();
