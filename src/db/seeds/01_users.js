const bcrypt = require('bcrypt');
const config = require('config');

const password = config.get('seed.user_password');
const hashedPwd = bcrypt.hashSync(password, 1);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('users').del();
    await knex('users').insert([
        {
            id: 1,
            first_name: 'Bojack',
            last_name: 'Horseman',
            email: 'bojack@example.com',
            password: hashedPwd,
        },
        {
            id: 2,
            first_name: 'Alice',
            last_name: 'George',
            email: 'alice@example.com',
            password: hashedPwd,
        },
        {
            id: 3,
            first_name: 'Lionel',
            last_name: 'Messi',
            email: 'Baker@example.com',
            password: hashedPwd,
        },
        {
            id: 4,
            first_name: 'Musa',
            last_name: 'Gate',
            email: 'musa@example.com',
            password: hashedPwd,
        },
    ]);
};
