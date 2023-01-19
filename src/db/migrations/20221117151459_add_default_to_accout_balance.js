/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('accounts', (table) => {
        table.decimal('balance').unsigned().defaultTo(0).notNullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('accounts', (table) => {
        table.decimal('balance').unsigned().defaultTo(0).notNullable().alter();
    });
};
