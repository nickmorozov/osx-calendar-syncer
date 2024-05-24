# osx-calendar-syncer

Allows to sync calendars using native Calendar/Reminders apps. No OAuth needed.

1. Finder Module: Spawns instances to query calendar and reminders apps for events/reminders not in the database.
1. Syncer Module: Handles creating, updating, and deleting events/reminders in the apps via osascript.
1. Database Module: Manages SQLite database connections.
1. Main Module: Orchestrates the process by coordinating the finder and syncer modules.
