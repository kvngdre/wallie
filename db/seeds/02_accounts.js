/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  await knex('accounts').insert([
    {id: 1, userId: 1, balance: 100},
    {id: 2, userId: 2, balance: 200},
    {id: 3, userId: 3, balance: 300},
  ]);
};
