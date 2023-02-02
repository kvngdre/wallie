/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes all existing transactions records
    await knex('transactions').del();

    await knex('transactions').insert([
        {
            id: 1,
            account_id: 1,
            type: 'credit',
            purpose: 'deposit',
            amount: 100,
            reference: 'ref1',
            description: 'Small funds',
            bal_before: 0,
            bal_after: 100,
        },
        {
            id: 2,
            account_id: 2,
            type: 'credit',
            purpose: 'deposit',
            amount: 200,
            reference: 'ref2',
            description: 'seed funds',
            bal_before: 0,
            bal_after: 200,
        },
        {
            id: 3,
            account_id: 3,
            type: 'credit',
            purpose: 'deposit',
            amount: 300,
            reference: 'ref3',
            description: 'securing the bag',
            bal_before: 0,
            bal_after: 300,
        },
    ]);
};
