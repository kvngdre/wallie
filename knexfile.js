const path = require('path');
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/src/config');
require('dotenv').config();

const config = require('config');
const { knexSnakeCaseMappers } = require('objection');

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.name'),
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, '/src/db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, '/src/db/seeds/'),
        },
        // ...knexSnakeCaseMappers(),
    },

    test: {
        client: 'mysql2',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.name'),
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, '/src/db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, '/src/db/seeds/'),
        },
        ...knexSnakeCaseMappers(),
    },

    production: {
        client: 'mysql2',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.name'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: path.join(__dirname, '/src/db/migrations'),
            tableName: 'knex_migrations',
        },
        ...knexSnakeCaseMappers(),
    },
};
