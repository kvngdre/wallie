const config = require('../../src/config/config');
const Knex = require('knex');

const database = config.db.test.name;

const knex = Knex({
    client: 'mysql2',
    connection: {
        host: config.db.test.host,
        port: config.db.test.port,
        user: config.db.test.user,
        password: config.db.test.password,
        database: database,
    },
    pool: { min: 0, max: 7 },
});

module.exports = async () => {
    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
        console.log('Test DB dropped.');
    } catch (error) {
        console.error(error.message, error.stack);
        process.exit(1);
    } finally {
        knex.destroy();
        process.exit(1);
    }
};
