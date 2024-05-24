#!/usr/bin/env node

const { connectDB, closeDB } = require('./db');
require('dotenv').config(); // Load environment variables
const process = require('process');
const logger = require('./logger');

async function init() {
  logger.log('Initializing database...');

  connectDB();

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

init()
  .then(() => logger.log('Initialization exiting...'))
  .catch((reason) => logger.error(reason));
