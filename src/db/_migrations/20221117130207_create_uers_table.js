/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.binary('id', 16).primary().defaultTo();
    table.string('first_name', 30).notNullable();
    table.string('last_name', 30).notNullable();
    table.string('email', 100).unique().notNullable();
    table.text('password').notNullable();
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
  return knex.schema.dropTableIfExists('users');
}
