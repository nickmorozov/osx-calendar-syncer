const osascript = require('osascript');

/**
 * Syncs an item to a target calendar.
 * @param {Object} item - The item to sync.
 * @param {string} type - The type of item ('event' or 'reminder').
 * @returns {Promise<string>} - The result of the sync.
 */
function syncItem(item, type) {
  const properties = {
    summary: item.title,
    start_date: item.start,
    end_date: item.end,
    notes: item.notes,
    is_all_day: item.allday,
    canceled: item.canceled,
  };

  const script = `
        tell application "${type === 'event' ? 'Calendar' : 'Reminders'}"
            tell calendar "${item.calendar}"
                make new ${type} with properties ${JSON.stringify(properties)}
            end tell
        end tell
    `;

  return new Promise((resolve, reject) => {
    osascript(script, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  syncItem,
};
