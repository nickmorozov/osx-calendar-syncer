#!/usr/bin/env node

const { exec } = require('child_process');
const osascript = require('osascript');
const sqlite3 = require('sqlite3').verbose();

/**
 * @typedef {Object} Data
 * @property {string} marker - The sync marker.
 * @property {string} start - The start date.
 * @property {string} end - The end date.
 * @property {Object} prefixesByCalendars - The prefixes by calendars.
 * @property {Object} listsByTarget - The lists by target.
 * @property {Array} personalSources - The personal sources.
 * @property {Array} familySources - The family sources.
 * @property {Array} workSources - The work sources.
 * @property {Object} targetKeysBySources - The target keys by sources.
 * @property {Array} events - The events.
 * @property {Array} reminders - The reminders.
 */

console.log('Connecting to SQLite DB');
const db = new sqlite3.Database('./db/syncer.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Run shortcut to retrieve all events
exec('echo "" | shortcuts run Syncer', (error, stdout, stderr) => {
    console.log(`\n>>>>> ${new Date().toLocaleString()}\n`);

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    /** @type {Data} */
    const data = JSON.parse(stdout);

    // Run config
    const syncMarker = data.marker;
    const startDate = data.start;
    const endDate = data.end;
    const prefixesByCalendars = data.prefixesByCalendars;
    const listsByTarget = data.listsByTarget;
    const personalSources = data.personalSources;
    const familySources = data.familySources;
    const workSources = data.workSources;
    const targetKeysBySources = data.targetKeysBySources;

    // Data
    const events = data.events;
    const reminders = data.reminders;

    // Go over each event, insert into db as not synced if not present
    events.forEach((event) => {
        db.get(
            `SELECT rowid
            FROM events
            WHERE calendar = ?
              AND title = ?
              AND created = ?`,
            [event.calendar, event.title, event.created],
            (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                if (row) {
                    console.log(`Found event with id ${row.rowid}`);
                    // TODO: check for changes and update db, set some "synced" flag to false
                    // then we would check junctions and based on that - decide insert row and create event or update both
                } else {
                    console.log(`No event found for ${event.title}, creating new entry`);
                    db.run(
                        `INSERT INTO events(calendar, title, start, end, location, notes, allday, canceled, status, created, synced, source, target)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            event.calendar,
                            event.title,
                            event.start,
                            event.end,
                            event.location,
                            event.notes,
                            event.allday,
                            event.canceled,
                            event.status,
                            event.created,
                            false,
                            true,
                            false,
                        ],
                        function (err) {
                            if (err) {
                                return console.log(err.message);
                            }
                            console.log(`A row has been inserted with rowid ${this.lastID}`);
                        }
                    );
                }
            }
        );
    });

    // Query not synced events and create them
    db.all(
        `SELECT *
          FROM events
          WHERE synced = ?`,
        [false],
        (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);

                const key = targetKeysBySources[row.calendar];
                data[key].forEach((targetCalendar) => {
                    osascript(
                        `tell application "Calendar"
    tell calendar "${targetCalendar}"
        make new event with properties {
            summary: "${row.title}",
            start date: "${row.start}",
            end date: "${row.end}",
            notes: "${row.notes} ${syncMarker}",
            is all day: ${row.allday},
            canceled: ${row.canceled}
        }
        return result
    end tell
end tell`,
                        function (err, result) {
                            console.log(err, result);
                            if (result) {
                                db.run(
                                    `UPDATE events
                                    SET synced = ?
                                    WHERE rowid = ?`,
                                    [true, row.rowid],
                                    (err) => {
                                        if (err) {
                                            return console.error(err.message);
                                        }
                                        console.log(`Row(s) updated: ${this.changes}`);

                                        db.run(
                                            `INSERT INTO events(calendar, title, start, end, location, notes, allday, canceled, status, created, synced, source, target)
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                            [
                                                targetCalendar, // TODO: insert first, create, then set synced=true
                                                row.title,
                                                row.start,
                                                row.end,
                                                row.location,
                                                row.notes + ' ' + syncMarker,
                                                row.allday,
                                                row.canceled,
                                                row.status,
                                                row.created,
                                                true,
                                                false,
                                                true,
                                            ],
                                            function (err) {
                                                if (err) {
                                                    return console.log(err.message);
                                                }
                                                console.log(
                                                    `A row has been inserted with rowid ${this.lastID}`
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        }
                    );
                });
            });
        }
    );

    // Finally, close the connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});
