const Knex = require('knex');
const knexfile = require('./knexfile');
const debug = require('debug')('app:db');

const config = knexfile[process.env.NODE_ENV];
const knex = Knex(config);

knex.raw('SELECT VERSION()')
    .then(() => {
        debug('Connected to MySQL DB');
    })
    .catch((error) => debug(`Failed to connect to DB ${error}`));

module.exports = knex;
