const init = require('../src/init');
const { connectDB, closeDB } = require('../src/db');
const logger = require('../src/logger');

jest.mock('../src/db');
jest.mock('../src/logger');

describe('Main Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize the database successfully', async () => {
    connectDB.mockReturnValue({});
    closeDB.mockImplementation(() => {});

    await init();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(closeDB).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith('Initializing database...');
    expect(logger.log).toHaveBeenCalledWith('Database initialized.');
    expect(logger.log).toHaveBeenCalledWith('Initialization finished.');
  });

  test('should handle errors during database initialization', async () => {
    connectDB.mockImplementation(() => {
      throw new Error('Initialization error');
    });
    closeDB.mockImplementation(() => {});

    await init();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(closeDB).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith('Initializing database...');
    expect(logger.error).toHaveBeenCalledWith('Error initializing database: Initialization error');
    expect(logger.log).toHaveBeenCalledWith('Initialization finished.');
  });
});
