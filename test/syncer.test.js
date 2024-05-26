const { syncItem } = require('../src/syncer');

describe('Syncer Module', () => {
  test('should sync an event', async () => {
    jest.setTimeout(15000); // Increase the timeout
    const event = {
      title: 'Test Event',
      start: '2024-01-01T10:00:00',
      end: '2024-01-01T11:00:00',
      notes: 'Test notes',
      allday: false,
      canceled: false,
      calendar: 'Test Calendar',
    };
    const result = await syncItem(event, 'event');
    expect(result).toBeDefined();
  });

  test('should sync a reminder', async () => {
    jest.setTimeout(15000); // Increase the timeout
    const reminder = {
      title: 'Test Reminder',
      due: '2024-01-01T10:00:00',
      notes: 'Test notes',
      complete: false,
      calendar: 'Test Calendar',
    };
    const result = await syncItem(reminder, 'reminder');
    expect(result).toBeDefined();
  });
});
