/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, firstName: 'Bojack', lastName: 'Horseman', email: 'bojack@example.com', password: 'Password1!'},
    {id: 2, firstName: 'Alice', lastName: 'George', email: 'alice@example.com', password: 'Password1!'},
    {id: 3, firstName: 'Lionel', lastName: 'Messi', email: 'Baker@example.com', password: 'Password1!'},
  ]);
};
