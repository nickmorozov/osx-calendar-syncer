const fs = require('fs');
const process = require('process');
require('dotenv').config(); // Load environment variables

// Get log file name from environment variables
const logFileName = process.env.LOG_FILE || 'syncer.log';

// Redirect console output to log file
const logFile = fs.createWriteStream(logFileName, { flags: 'a' });
const logStdout = process.stdout;

function log(message) {
  logFile.write(message + '\n');
  logStdout.write(message + '\n');
}

function error(message) {
  logFile.write('ERROR: ' + message + '\n');
  logStdout.write('ERROR: ' + message + '\n');
}

function end(callback) {
  logFile.end(callback);
}

module.exports = {
  log,
  error,
  end,
};
