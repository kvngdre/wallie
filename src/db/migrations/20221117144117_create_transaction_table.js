import {
  TransactionPurpose,
  TransactionType,
} from '../../transaction/jsdoc/transaction.types.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.uuid('account_id').notNullable().index();
    table
      .foreign('account_id')
      .references('id')
      .inTable('accounts')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .datetime('timestamp')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.enu('type', Object.values(TransactionType)).notNullable();
    table.enu('purpose', Object.values(TransactionPurpose)).notNullable();
    table.decimal('amount', 10, 2).unsigned().notNullable();
    table.string('reference').unique().notNullable();
    table.string('description', 50).defaultTo(null);
    table.uuid('destination_account_id').nullable().defaultTo(null);
    table.decimal('balance_before').unsigned().notNullable();
    table.decimal('balance_after').unsigned().notNullable();
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('transactions');
}
