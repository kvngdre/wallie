import bcrypt from 'bcryptjs';
import { admin, user } from '../../utils/userRoles.utils';

const hashedPassword = bcrypt.hashSync('Password1!', 12);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // * Deletes all existing user records.
  await knex('users').del();

  await knex('users').insert([
    {
      id: 1,
      first_name: 'Bojack',
      last_name: 'Horseman',
      email: 'bojack@email.com',
      password: hashedPassword,
      role: admin,
    },
    {
      id: 2,
      first_name: 'Alice',
      last_name: 'George',
      email: 'alice@email.com',
      password: hashedPassword,
      role: user,
    },
    {
      id: 3,
      first_name: 'Lionel',
      last_name: 'Messi',
      email: 'lionel@email.com',
      password: hashedPassword,
      role: user,
    },
    {
      id: 4,
      first_name: 'Musa',
      last_name: 'Gate',
      email: 'musa@email.com',
      password: hashedPassword,
      role: user,
    },
  ]);
};
