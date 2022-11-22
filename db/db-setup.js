const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile');

function setupDB() {
    const config = knexfile[process.env.NODE_ENV];
    const knex = Knex(config);

    knex.raw('SELECT VERSION()')
        .then(() => {
            console.log('Connected to MySQL DB');
        })
        .catch((error) => console.log(`Failed to connect to DB ${error}`));

    Model.knex(knex);
}

module.exports = setupDB;
