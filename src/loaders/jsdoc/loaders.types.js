/**
 * @typedef {'development' | 'production' | 'staging' | 'test'} NodeEnv
 */

/**
 * @typedef {Object.<string, import('knex').Knex.Config>} KnexEnvConfig
 * @description A mapping of node environments to knex database configurations.
 */

/**
 * @callback getAppRouter
 * @description - A function that creates an express router with the app routes.
 * @requires module:express.Router
 * @returns {Router} - The express router with the app routes.
 */

/**
 * @function startApp
 * @description - A function that runs the start up sequence of the application.
 * @param {import('express').Express} expressApp
 * @param {(import('express').Router|getAppRouter)} appRouter - An express router instance or a function that creates an express router with the app routes
 */

/**
 * @typedef {function(import('express').Express, import('express').Router|getAppRouter): Promise<void>} startApp
 * @description - A function that runs the start up sequence of the application.
 */

/**
 * @typedef {import('knex').Knex.Config} DatabaseConfiguration
 * @property {string} client - The database client
 * @property {Object} connection
 * @property {string} connection.host - The database host
 * @property {(string|number)} connection.port - The database port number.
 * @property {string} connection.user - The database username
 * @property {string} [connection.password] - The password to the database username.
 * @property {string} [connection.database] - The name of the database to connect to.
 */
