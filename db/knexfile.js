process.env.NODE_CONFIG_DIR = require('path').join(__dirname, '../config');
require('dotenv').config({ path: '../.env' });
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
            tableName: 'knex_migrations',
        },
        ...knexSnakeCaseMappers(),
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
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
