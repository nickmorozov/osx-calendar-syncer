module.exports = {
  dateRange: {
    startOffset: -1 * 7 * 24 * 60 * 60 * 1000, // Subtract 1 week
    endOffset: 2 * 7 * 24 * 60 * 60 * 1000, // Add 2 weeks
  },
  emojiPrefixesByCalendars: {
    Birthdays: '🎂',
    'Canadian Holidays': '🇨🇦',
    Garbage: '🗑',
    Counselling: '🧠',
    Massage: '💆‍♂️',
    Nick: '💪',
    Maria: '🎨',
    Family: '👨‍👩‍👧‍👦',
    Calendar: '📅',
  },
  listsByTarget: {
    Nick: ['list1', 'list2'],
    Family: ['list3', 'list4'],
  },
  sources: {
    personalSources: ['source1', 'source2'],
    familySources: ['source3', 'source4', 'source5'],
    workSources: ['source6', 'source7'],
  },
  targetKeysBySources: {
    source1: ['targetCalendar1'],
    source2: ['targetCalendar2'],
    // Add more mappings as needed
  },
};
