# osx-calendar-syncer

Allows to sync calendars using native Calendar/Reminders apps. No OAuth needed.

1. Finder Module: Spawns instances to query calendar and reminders apps for events/reminders not in the database.
1. Syncer Module: Handles creating, updating, and deleting events/reminders in the apps via osascript.
1. Database Module: Manages SQLite database connections.
1. Main Module: Orchestrates the process by coordinating the finder and syncer modules.

Project Structure
Configuration and Metadata Files:

package.json: Contains the project dependencies, scripts, and configuration.
package-lock.json: Records the exact versions of installed dependencies.
.env: Environment variables configuration.
.eslintignore: Specifies files and directories that should be ignored by ESLint.
.eslintrc: Configuration for ESLint.
.gitignore: Specifies files and directories that should be ignored by Git.
.huskyrc: Configuration for Husky.
.prettierignore: Specifies files and directories that should be ignored by Prettier.
.prettierrc: Configuration for Prettier.
.stylelintrc: Configuration for Stylelint.
lint-staged.config.js: Configuration for lint-staged.
launch.json: Debugger configuration (usually for VSCode).
Source Code:

src/db.js: Database interaction module.
src/finder.js: Module for querying calendar and reminders apps for events/reminders not in the database.
src/syncer.js: Module for syncing events/reminders with the apps.
src/config.js: Configuration module for managing application settings.
src/init.js: Initialization script for setting up the database.
src/main.js: Main script orchestrating the entire process.
Database:

db/syncer.db: SQLite database file.
Logs:

syncer.log: Log file.
Documentation:

README.md: Project documentation.
IDE Configuration:

.idea/: Configuration files for JetBrains IDEs like IntelliJ IDEA or WebStorm.
Analysis and Suggestions for Improvement
Code Structure and Modularity:

The project is well-structured with separate modules for different functionalities (database interaction, finding
events/reminders, syncing).
Ensure that each module has clear and single responsibility to adhere to the Single Responsibility Principle.
Configuration Management:

The configuration file (config.js) centralizes configuration settings, which is good practice.
Consider using a library like dotenv to manage environment variables, making it easier to configure the application for
different environments (development, staging, production).
Error Handling:

Ensure that all asynchronous operations (e.g., database queries, osascript executions) have proper error handling to
avoid unhandled promise rejections.
Implement logging for errors and important events to syncer.log for better traceability and debugging.
Dependency Management:

The dependencies listed in package.json seem appropriate for the project's needs.
Regularly update dependencies to benefit from security patches and new features.
Code Quality and Consistency:

Utilize ESLint and Prettier for maintaining code quality and consistency.
Ensure that all code is properly formatted and linted before commits using Husky and lint-staged.
Testing:

Add a testing framework like Jest or Mocha to create unit tests for the different modules.
Ensure that critical functionalities are covered by tests to prevent regressions.
Documentation:

Update README.md with comprehensive instructions on setting up and running the project.
Include examples of environment variable configurations and explain the purpose of each module.
Security:

Ensure sensitive information (e.g., API keys, database credentials) is stored securely and not hardcoded in the source
code.
Use environment variables and .env file for sensitive configurations.
