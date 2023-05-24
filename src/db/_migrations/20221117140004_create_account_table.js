/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.binary('id', 16).primary();
    table
      .binary('user_id')
      .unsigned()
      .unique()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE') // If the user Pk is changed, update the fk as well.
      .onDelete('CASCADE'); // If the user is deleted, delete account as well.
    table.text('pin').notNullable();
    table.decimal('balance').unsigned().defaultTo(0).notNullable();
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
  return knex.schema.dropTableIfExists('accounts');
}
