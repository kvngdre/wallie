require("dotenv").config();
const { knexSnakeCaseMappers } = require('objection');
const config = require('config');
const Knex = require('knex');
const path = require('path');

// const database = process.env.TEST_DB_NAME;
const database = config.get('database.test_name');

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
            database: config.get('database.test_name'),
        },
        pool: { min: 0, max: 7 },
        migrations: {
            directory: path.join(__dirname, '../../db/migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.join(__dirname, '../../db/seeds/'),
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
