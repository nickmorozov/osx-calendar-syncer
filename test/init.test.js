const init = require('../src/init');
const { connectDB, closeDB } = require('../src/db');
const logger = require('../src/logger');

jest.mock('../src/db');
jest.mock('../src/logger');

describe('Init Script', () => {
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
    const error = new Error('Initialization error');
    connectDB.mockImplementation(() => {
      throw error;
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
