const { parentPort, workerData } = require('worker_threads');
const { findEvents, findReminders } = require('./finder');
const logger = require('./logger');

async function fetchPeriod(startDate, endDate) {
  try {
    const events = await findEvents(startDate, endDate);
    const reminders = await findReminders(startDate, endDate);
    parentPort.postMessage({ events, reminders, startDate, endDate });
  } catch (error) {
    parentPort.postMessage({ error: error.message, startDate, endDate });
  }
}

fetchPeriod(workerData.startDate, workerData.endDate)
  .then(() => logger.info('Fetch completed.'))
  .catch((reason) => logger.error(reason));
