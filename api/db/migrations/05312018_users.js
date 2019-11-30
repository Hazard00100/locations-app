exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('users', table => {
    table.increments();
    table.timestamp('createdAt').notNullable().defaultTo(knex.raw('now()'));
    table.string('firstname').unique().notNullable();
    table.string('lastname').unique().notNullable();
    table.string('dob').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('driverLincense').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};

// ALTER TABLE users ADD COLUMN firstName VARCHAR(255) NOT NULL DEFAULT ""; 
// ALTER TABLE users ADD COLUMN lastName STRING;
// ALTER TABLE users ADD COLUMN dob STRING;
// ALTER TABLE users ADD COLUMN driverLincense STRING;