const { admin, user } = require('../../utils/userRoles');
const bcrypt = require('bcrypt');

const hashedPwd = bcrypt.hashSync('Password1!', 10);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes all existing user records.
    await knex('users').del();

    await knex('users').insert([
        {
            id: 1,
            first_name: 'Bojack',
            last_name: 'Horseman',
            email: 'bojack@email.com',
            password: hashedPwd,
            role: admin,
        },
        {
            id: 2,
            first_name: 'Alice',
            last_name: 'George',
            email: 'alice@email.com',
            password: hashedPwd,
            role: user,
        },
        {
            id: 3,
            first_name: 'Lionel',
            last_name: 'Messi',
            email: 'lionel@email.com',
            password: hashedPwd,
            role: user,
        },
        {
            id: 4,
            first_name: 'Musa',
            last_name: 'Gate',
            email: 'musa@email.com',
            password: hashedPwd,
            role: user
        },
    ]);
};
