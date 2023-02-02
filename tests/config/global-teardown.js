require('dotenv').config();
process.env['NODE_CONFIG_DIR'] = require('path').join(
    __dirname,
    '../../src/config'
);
const config = require('config');
const Knex = require('knex');

const database = config.get('database.name.test');

const knex = Knex({
    client: 'mysql2',
    connection: {
        host: config.get('database.host'),
        port: config.get('database.port'),
        user: config.get('database.user'),
        password: config.get('database.password'),
        database: database,
    },
    pool: { min: 0, max: 7 },
});

module.exports = async () => {
    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        knex.destroy();
        process.exit(1);
    }
};
