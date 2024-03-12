export const up = async function (knex) {
  return knex.schema.createTable('todos', function (table) {
    table.increments('id').primary();
    table.text('description').notNullable();
  });
};

export const down = async function (knex) {
  return knex.schema.dropTableIfExists('todos');
};
