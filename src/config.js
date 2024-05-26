module.exports = {
  dateRange: {
    // Weeks * Days * Hours * Minutes * Seconds * Milliseconds
    startOffset: -1 * 1 * 24 * 60 * 60 * 1000, // Subtract 1 day
    endOffset: 1 * 1 * 24 * 60 * 60 * 1000, // Add 1 day
  },
  emojiPrefixesByCalendars: {
    Birthdays: '🎂 ',
    'Canadian Holidays': '🇨🇦 ',
    Garbage: '🚛 ',
    Counselling: '🧠 ',
    Massage: '💪 ',
    Nick: '⭐ ',
    Maria: '⭐ ',
    Family: '🎈 ',
    Calendar: '🖥 ',
    Corrao: '🖥 ',
  },
  listsByTarget: {
    Nick: ['Reminders', 'Work'],
    Family: ['Home', 'Groceries', 'Shopping'],
  },
  sources: {
    personalSources: ['Nick', 'Counselling', 'Massage'],
    familySources: ['Family', 'Garbage'],
    workSources: ['Calendar', 'Corrao'],
  },
  targetKeysBySources: {
    personalSources: ['Nick'],
    familySources: ['Family'],
    workSources: ['Work'],
  },
};
