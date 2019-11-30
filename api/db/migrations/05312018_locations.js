//Name, location (longitude/latitude), address, type (Hospital,School,Park,Supermarket), Status (Approve/deny/pending).

exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('locations', table => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.specificType('point', 'POINT').defaultTo(knex.raw('POINT (10.801241, 106.712710)'));
    table.string('address').notNullable().defaultTo('');
    table.integer('userId').notNullable();
    table.integer('typeOfPlaceId').notNullable();
    table.integer('statusId').notNullable();
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('locations');
};