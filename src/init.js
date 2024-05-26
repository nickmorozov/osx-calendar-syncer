#!/usr/bin/env node

const { connectDB, closeDB } = require('./db');
const logger = require('./logger');

async function init() {
  logger.log('Initializing database...');

  const db = connectDB();

  try {
    // Your database initialization logic here
    logger.log('Database initialized.');
  } catch (err) {
    logger.error(`Error initializing database: ${err.message}`);
  } finally {
    closeDB();
    logger.log('Initialization finished.');

    // Ensure logs are flushed before exiting
    logger.end(() => {
      process.exit(0);
    });
  }
}

if (require.main === module) {
  init()
    .then(() => logger.log('Initialization exiting...'))
    .catch((reason) => logger.error(reason));
}

module.exports = init;
