const Knex = require('knex');
const config = require('../../src/config/config');
const path = require('path');

const dbName = config.db.test.name || 'wallie_test';

// Create the database
async function createTestDatabase() {
    const knex = Knex({
        client: 'mysql2',
        connection: {
            host: config.db.test.host,
            port: config.db.test.port,
            user: config.db.test.user,
            password: config.db.test.password,
        },
        pool: { min: 0, max: 7 },
    });

    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${dbName}`);
        await knex.raw(`CREATE DATABASE ${dbName}`);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    } finally {
        await knex.destroy();
    }
}

// Seed the database with schema and data
async function runMigrationsAndSeedTestDatabase() {
    const knex = Knex({
        client: 'mysql2',
        connection: {
            host: config.db.test.host,
            port: config.db.test.port,
            user: config.db.test.user,
            password: config.db.test.password,
            database: dbName,
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, '../../src/db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, '../../src/db/seeds'),
        },
    });

    try {
        await knex.migrate.latest();
        await knex.seed.run();
    } catch (error) {
        throw new Error(error);
    } finally {
        await knex.destroy();
    }
}

module.exports = async () => {
    try {
        await createTestDatabase();
        await runMigrationsAndSeedTestDatabase();
        console.log('Test database created successfully 🚀');
    } catch (error) {
        console.error(error.message, error?.stack);
        process.exit(1);
    }
};
