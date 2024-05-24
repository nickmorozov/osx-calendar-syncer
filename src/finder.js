const osascript = require('osascript');
const { connectDB } = require('./db');

/**
 * Finds events/reminders not in the database.
 * @param {string} date - The date to query for events/reminders.
 * @returns {Promise<Array>} - A promise that resolves to the found events/reminders.
 */
function findEvents(date) {
  return new Promise((resolve, reject) => {
    osascript.execute(
      `
            tell application "Calendar"
                set eventsList to (get properties of (every event where start date is in {${date}}))
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

function findReminders(date) {
  return new Promise((resolve, reject) => {
    osascript.execute(
      `
            tell application "Reminders"
                set remindersList to (get properties of (every reminder where due date is in {${date}}))
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
