const { Model } = require('objection');
const debug = require('debug')('app:db.loader');
const Knex = require('knex');
const knexfile = require('../../knexfile');

function setupDB() {
    const config = knexfile[process.env.NODE_ENV];
    const knex = Knex(config);

    knex.raw('SELECT VERSION()').catch((error) =>
        debug(`Failed to connect to DB ${error}`)
    );

    Model.knex(knex);
}

module.exports = setupDB;
