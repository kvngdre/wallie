process.env.NODE_CONFIG_DIR = require('path').join(__dirname, '../config');
require('dotenv').config({ path: '../.env' });
const config = require('config');
const { knexSnakeCaseMappers } = require('objection');
const path = require('path');

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
            tableName: 'knex_migrations',
        },
        ...knexSnakeCaseMappers(),
    },

    test: {
        client: 'mysql2',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.test_name'),
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, 'db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, 'db/seeds/')
        },
        ...knexSnakeCaseMappers(),
    },

    production: {
        client: 'mysql',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.test_name'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
        ...knexSnakeCaseMappers(),
    },
};
