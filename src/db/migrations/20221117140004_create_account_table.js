/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('accounts', (table) => {
        table.increments('id').primary();
        table
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')   
            .inTable('users')
            .onUpdate('CASCADE') // if the user Pk is changed, update the fk as well.
            .onDelete('CASCADE'); // if the user is deleted, delete account as well.
        table.decimal('balance').unsigned().notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('accounts');
};
