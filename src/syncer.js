const osascript = require('osascript');
const { connectDB } = require('./db');

/**
 * Finds events/reminders not in the database.
 * @param {string} startDate - The start date to query for events/reminders.
 * @param {string} endDate - The end date to query for events/reminders.
 * @returns {Promise<Array>} - A promise that resolves to the found events/reminders.
 */
function findEvents(startDate, endDate) {
  return new Promise((resolve, reject) => {
    osascript(
      `
            tell application "Calendar"
                set eventsList to (get properties of (every event where start date is greater than or equal to date "${startDate}" and end date is less than or equal to date "${endDate}"))
            end tell
            return eventsList
        `,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
}

function findReminders(startDate, endDate) {
  return new Promise((resolve, reject) => {
    osascript(
      `
            tell application "Reminders"
                set remindersList to (get properties of (every reminder where due date is greater than or equal to date "${startDate}" and due date is less than or equal to date "${endDate}"))
            end tell
            return remindersList
        `,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
}

module.exports = {
  findEvents,
  findReminders,
};
