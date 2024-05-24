#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/syncer.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run('DROP TABLE IF EXISTS reminders')
    .run('DROP TABLE IF EXISTS events')
    .run('DROP TABLE IF EXISTS junctions')
    .run(
      `CREATE TABLE IF NOT EXISTS reminders(
      rowid INTEGER PRIMARY KEY,
      list TEXT NOT NULL,
      created TEXT NOT NULL,
      modified TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      due TEXT NOT NULL,
      complete BOOLEAN,
      synced BOOLEAN,
      source BOOLEAN,
      target BOOLEAN
    )`
    )
    .run(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_reminders_list_title_created
      ON reminders(list, title, created)`
    )
    .run(
      `CREATE TABLE IF NOT EXISTS events(
      rowid INTEGER PRIMARY KEY,
      calendar TEXT NOT NULL,
      created TEXT NOT NULL,
      modified TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      duration INTEGER,
      allday BOOLEAN,
      canceled BOOLEAN,
      status TEXT,
      location TEXT,
      synced BOOLEAN,
      source BOOLEAN,
      target BOOLEAN
    )`
    )
    .run(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_events_calendar_title_created
      ON events(calendar, title, created)`
    )
    .run(
      `CREATE TABLE IF NOT EXISTS junctions(
      rowid INTEGER PRIMARY KEY,
      sourceid INTEGER NOT NULL,
      targetid INTEGER NOT NULL,
      created TEXT NOT NULL,
      modified TEXT NOT NULL
    )`
    )
    .run(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_junctions_sourceid_targetid
      ON junctions(sourceid, targetid)`
    )
    // YYYY-MM-DD HH:MM:SS.SSS
    .run(
      `INSERT INTO events (calendar, created, modified, title, notes, start, end, duration, allday, canceled, status, location)
      VALUES
        ("Some Calendar", "2024-01-01 00:00:00.000", "2024-02-02 00:00:00.000", "test1", "notes1", "2024-03-03 00:00:00.000", "2024-04-04 00:00:00.000", 60, FALSE, FALSE, "Pending", "Langley"),
        ("Some Calendar", "2024-01-01 00:00:00.000", "2024-02-02 00:00:00.000", "test2", "notes2", "2024-03-03 00:00:00.000", "2024-04-04 00:00:00.000", 60, FALSE, FALSE, "Pending", "Langley"),
        ("Some Calendar", "2024-01-01 00:00:00.000", "2024-02-02 00:00:00.000", "test3", "notes3", "2024-03-03 00:00:00.000", "2024-04-04 00:00:00.000", 60, FALSE, FALSE, "Pending", "Langley")`
    )
    .each(`SELECT * FROM events`, (err, row) => {
      if (err) {
        throw err;
      }
      console.log(row);
    });
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
