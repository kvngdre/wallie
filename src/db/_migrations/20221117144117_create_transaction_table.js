/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table
      .binary('account_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('accounts')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.enum('type', ['debit', 'credit']).notNullable();
    table.string('purpose').notNullable();
    table.decimal('amount').unsigned().notNullable();
    table.string('reference').unique().notNullable();
    table.string('description', 50);
    table.decimal('bal_before').unsigned().notNullable();
    table.decimal('bal_after').unsigned().notNullable();
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
