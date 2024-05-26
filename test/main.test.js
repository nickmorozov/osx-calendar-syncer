const main = require('../src/main');
const { connectDB, closeDB } = require('../src/db');
const logger = require('../src/logger');

jest.mock('../src/db');
jest.mock('../src/logger');

describe('Main Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should run the main script successfully', async () => {
    connectDB.mockReturnValue({});
    closeDB.mockImplementation(() => {});

    await main();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(closeDB).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith('Starting syncer...');
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Fetching events and reminders'));
    expect(logger.log).toHaveBeenCalledWith('Syncer finished.');
  });

  test('should handle errors during database initialization', async () => {
    connectDB.mockImplementation(() => {
      throw new Error('Initialization error');
    });
    closeDB.mockImplementation(() => {});

    await expect(main()).rejects.toThrow('Initialization error');

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(closeDB).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith('Starting syncer...');
    expect(logger.error).toHaveBeenCalledWith('Error during sync process: Initialization error');
    expect(logger.log).toHaveBeenCalledWith('Syncer finished.');
  });
});
