const { Model } = require('objection');
const debug = require('debug')('app:db');
const Knex = require('knex');
const knexfile = require('./knexfile');

function setupDB() {
    const config = knexfile[process.env.NODE_ENV];
    const knex = Knex(config);

    knex.raw('SELECT VERSION()')
        .then(() => {
            debug('Connected to MySQL DB');
        })
        .catch((error) => debug(`Failed to connect to DB ${error}`));

    Model.knex(knex);
}

module.exports = setupDB;
