import {
  TransactionPurpose,
  TransactionType,
} from '../../transaction/jsdoc/transaction.types';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table
      .binary('account_id')
      .notNullable()
      .references('id')
      .inTable('accounts')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.enum('type', Object.values(TransactionType)).notNullable();
    table.enum('purpose', Object.values(TransactionPurpose)).notNullable();
    table.decimal('amount', 10, 2).unsigned().notNullable();
    table.string('reference').unique().notNullable();
    table.string('description', 50).defaultTo(null);
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
