const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('./logger');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, './db/syncer.db');
let db;

function connectDB() {
  if (!db) {
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        logger.error(err.message);
      } else {
        logger.log('Connected to the SQLite database.');
      }
    });
  }
  return db;
}

function closeDB() {
  if (db) {
    db.close((err) => {
      if (err) {
        logger.error(err.message);
      } else {
        logger.log('Closed the database connection.');
      }
    });
  }
}

module.exports = {
  connectDB,
  closeDB,
};
