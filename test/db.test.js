const { connectDB, closeDB } = require('../src/db');
const sqlite3 = require('sqlite3').verbose();

describe('Database Module', () => {
  let db;

  beforeAll(() => {
    db = connectDB();
  });

  afterAll(() => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  test('should connect to the database', () => {
    expect(db).toBeInstanceOf(sqlite3.Database);
  });

  test('should close the database connection', () => {
    db = connectDB(); // Reconnect the DB to ensure it's open
    return new Promise((resolve, reject) => {
      db.close((err) => {
        expect(err).toBeNull(); // Add assertion
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
});
