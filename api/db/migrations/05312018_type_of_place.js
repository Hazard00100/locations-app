//Name, location (longitude/latitude), address, type (Hospital,School,Park,Supermarket), Status (Approve/deny/pending).

exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('typeOfPlace', table => {
    table.increments();
    table.string('name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('typeOfPlace');
};