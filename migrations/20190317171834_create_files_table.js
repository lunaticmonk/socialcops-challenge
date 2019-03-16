exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("files", function(table) {
      table.string("id", 32).primary();
      table.text("path").notNullable();
      table.string("event").nullable();
      table.text("hash");
      table
        .integer("updated_at")
        .unsigned()
        .notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("files");
};
