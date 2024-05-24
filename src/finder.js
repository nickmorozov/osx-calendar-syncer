const osascript = require('osascript');

/**
 * Finds events/reminders not in the database.
 * @param {string} date - The date to query for events/reminders.
 * @returns {Promise<Array>} - A promise that resolves to the found events/reminders.
 */
function findEvents(date) {
  return new Promise((resolve, reject) => {
    osascript(
      `
        log "Finding events on date: " & ${date}
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
    osascript(
      `
        log "Finding reminders on date: " & ${date}
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
