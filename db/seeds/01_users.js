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
            firstName: 'Bojack',
            lastName: 'Horseman',
            email: 'bojack@example.com',
            password: hashedPwd,
        },
        {
            id: 2,
            firstName: 'Alice',
            lastName: 'George',
            email: 'alice@example.com',
            password: hashedPwd,
        },
        {
            id: 3,
            firstName: 'Lionel',
            lastName: 'Messi',
            email: 'Baker@example.com',
            password: hashedPwd,
        },
        {
            id: 4,
            firstName: 'Musa',
            lastName: 'Gate',
            email: 'musa@example.com',
            password: hashedPwd,
        },
    ]);
};
