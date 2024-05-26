const osascript = require('osascript');

/**
 * Formats a date string to a format compatible with AppleScript.
 * @param {string} dateString - The date string in ISO format.
 * @returns {string} - The formatted date string.
 */
function formatDateForAppleScript(dateString) {
  const date = new Date(dateString);
  const appleScriptDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
  return `date "${appleScriptDate}"`;
}

/**
 * Executes an AppleScript command with a timeout.
 * @param {string} script - The AppleScript command to execute.
 * @param {number} timeout - The timeout in milliseconds.
 * @returns {Promise<string>} - The result of the execution.
 */
function executeWithTimeout(script, timeout = 120000) {
  // Increased timeout to 120 seconds
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('osascript execution timed out'));
    }, timeout);

    osascript(script, (err, result) => {
      clearTimeout(timer);
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

/**
 * Finds events within a date range.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {Promise<Array>} - The events found.
 */
function findEvents(startDate, endDate) {
  const formattedStartDate = formatDateForAppleScript(startDate);
  const formattedEndDate = formatDateForAppleScript(endDate);

  const script = `
        set startDate to ${formattedStartDate}
        set endDate to ${formattedEndDate}

        tell application "Calendar"
            set allCalendars to calendars
            set filteredEvents to {}
            
            repeat with aCalendar in allCalendars
                set allEvents to (every event of aCalendar whose start date is greater than or equal to startDate and end date is less than or equal to endDate)
                repeat with anEvent in allEvents
                    set eventProps to {summary:(get summary of anEvent), start date:(get start date of anEvent), end date:(get end date of anEvent)}
                    copy eventProps to end of filteredEvents
                end repeat
            end repeat
        end tell

        return filteredEvents
    `;
  console.log(`Executing script: ${script}`);
  return executeWithTimeout(script)
    .then((result) => {
      console.log(`Fetched events: ${result}`);
      return result;
    })
    .catch((err) => {
      console.error(`Error fetching events: ${err}`);
      throw err;
    });
}

/**
 * Finds reminders within a date range.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {Promise<Array>} - The reminders found.
 */
function findReminders(startDate, endDate) {
  const formattedStartDate = formatDateForAppleScript(startDate);
  const formattedEndDate = formatDateForAppleScript(endDate);

  const script = `
        set startDate to ${formattedStartDate}
        set endDate to ${formattedEndDate}

        tell application "Reminders"
            set allReminders to (every reminder whose due date is greater than or equal to startDate and due date is less than or equal to endDate)
            set filteredReminders to {}
            repeat with aReminder in allReminders
                set reminderProps to {name:(get name of aReminder), due date:(get due date of aReminder), body:(get body of aReminder)}
                copy reminderProps to end of filteredReminders
            end repeat
        end tell

        return filteredReminders
    `;
  console.log(`Executing script: ${script}`);
  return executeWithTimeout(script)
    .then((result) => {
      console.log(`Fetched reminders: ${result}`);
      return result;
    })
    .catch((err) => {
      console.error(`Error fetching reminders: ${err}`);
      throw err;
    });
}

module.exports = {
  findEvents,
  findReminders,
};
