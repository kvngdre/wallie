const path = require('path');
require('dotenv').config();
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, '../../src/config');

const { knexSnakeCaseMappers } = require('objection');
const config = require('config');
const Knex = require('knex');

const database = config.get('database.name');

// Create the database
async function createTestDatabase() {
    const knex = Knex({
        client: 'mysql2',
        connection: {
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
        },
        pool: { min: 0, max: 7 },
        ...knexSnakeCaseMappers(),
    });

    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
        await knex.raw(`CREATE DATABASE ${database}`);
    } catch (error) {
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
            host: config.get('database.host'),
            port: config.get('database.port'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.name'),
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, '../../src/db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, '../../src/db/seeds/'),
        },
        ...knexSnakeCaseMappers(),
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
        console.log('Test database created successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
