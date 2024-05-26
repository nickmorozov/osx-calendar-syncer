const logger = require('../src/logger');
jest.mock('../src/logger');

describe('Main Script', () => {
  test('should run the main script without errors', async () => {
    const main = require('../src/main');
    await main();
    expect(logger.log).toHaveBeenCalledWith('Starting syncer...');
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Fetching events and reminders'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Syncer finished.'));
  });
});
