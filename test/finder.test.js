const osascript = require('osascript');
const { findEvents, findReminders } = require('../src/finder');

jest.mock('osascript', () => jest.fn());

describe('Finder Module', () => {
  beforeEach(() => {
    osascript.mockClear();
  });

  test('should find events', async () => {
    const mockEvents = [
      {
        title: 'Test Event',
        start: '2024-01-01T10:00:00',
        end: '2024-01-01T11:00:00',
      },
    ];
    osascript.mockImplementation((script, callback) => {
      callback(null, mockEvents);
    });

    const events = await findEvents('2024-01-01', '2024-01-07');
    expect(events).toEqual(mockEvents);
    expect(osascript).toHaveBeenCalledTimes(1);
  });

  test('should handle errors when finding events', async () => {
    const mockError = new Error('Failed to fetch events');
    osascript.mockImplementation((script, callback) => {
      callback(mockError);
    });

    await expect(findEvents('2024-01-01', '2024-01-07')).rejects.toThrow('Failed to fetch events');
    expect(osascript).toHaveBeenCalledTimes(1);
  });

  test('should find reminders', async () => {
    const mockReminders = [
      {
        title: 'Test Reminder',
        due: '2024-01-01T10:00:00',
      },
    ];
    osascript.mockImplementation((script, callback) => {
      callback(null, mockReminders);
    });

    const reminders = await findReminders('2024-01-01', '2024-01-07');
    expect(reminders).toEqual(mockReminders);
    expect(osascript).toHaveBeenCalledTimes(1);
  });

  test('should handle errors when finding reminders', async () => {
    const mockError = new Error('Failed to fetch reminders');
    osascript.mockImplementation((script, callback) => {
      callback(mockError);
    });

    await expect(findReminders('2024-01-01', '2024-01-07')).rejects.toThrow('Failed to fetch reminders');
    expect(osascript).toHaveBeenCalledTimes(1);
  });
});
