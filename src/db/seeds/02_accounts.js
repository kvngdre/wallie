import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes all existing account records.
  await knex('accounts').del();

  await knex('accounts').insert([
    { id: 1, user_id: 1, pin: bcrypt.hashSync('1234', 10), balance: 100 },
    { id: 2, user_id: 2, pin: bcrypt.hashSync('4567', 10), balance: 200 },
    { id: 3, user_id: 3, pin: bcrypt.hashSync('7890', 10), balance: 300 },
  ]);
};
