const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('../../knexfile');
const logger = require('./logger');

function setupDB() {
    const config = knexfile[process.env.NODE_ENV];
    const knex = Knex(config);

    knex.raw('SELECT VERSION()').catch((error) =>
        logger.fatal(`Failed to connect to DB ${error}`)
    );

    Model.knex(knex);
}

module.exports = setupDB;
