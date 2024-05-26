const osascript = require('osascript');

/**
 * Finds events within a date range.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {Promise<Array>} - The events found.
 */
function findEvents(startDate, endDate) {
  return new Promise((resolve, reject) => {
    osascript(
      `
            tell application "Calendar"
                set eventsList to (get properties of (every event where start date is greater than or equal to date "${startDate}" and end date is less than or equal to date "${endDate}"))
            end tell
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

/**
 * Finds reminders within a date range.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {Promise<Array>} - The reminders found.
 */
function findReminders(startDate, endDate) {
  return new Promise((resolve, reject) => {
    osascript(
      `
            tell application "Reminders"
                set remindersList to (get properties of (every reminder where due date is greater than or equal to date "${startDate}" and due date is less than or equal to date "${endDate}"))
            end tell
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
