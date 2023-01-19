/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('transactions').del()
  await knex('transactions').insert([
    {id: 1, accountId: 1, txnType: 'credit', purpose: 'deposit', amount: 100, reference: 'ref1', balanceBefore: 0, balanceAfter: 100},
    {id: 2, accountId: 2, txnType: 'credit', purpose: 'deposit', amount: 200, reference: 'ref2', balanceBefore: 0, balanceAfter: 200},
    {id: 3, accountId: 3, txnType: 'credit', purpose: 'deposit', amount: 300, reference: 'ref3', balanceBefore: 0, balanceAfter: 300},
  ]);
};
