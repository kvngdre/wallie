/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table
            .integer('account_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('accounts')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        table.enum('txn_type', ['debit', 'credit']).notNullable();
        table
            .enum('purpose', ['deposit', 'transfer', 'withdrawal'])
            .notNullable();
        table.decimal('amount').unsigned().notNullable();
        table.string('reference').unique().notNullable();
        table.decimal('balanceBefore').unsigned().notNullable();
        table.decimal('balanceAfter').unsigned().notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('transactions');
};
