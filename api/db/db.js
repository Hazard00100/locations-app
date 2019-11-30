const config = require('../knexfile.js');
const knex = require('knex')(config['development']);

/*knex.migrate.latest(['development']).then(async () => {
  await knex('typeOfPlace').insert([
    {id: 1, name: 'hospital'},
    {id: 2, name: 'school'},
    {id: 3, name: 'park'},
    {id: 4, name: 'supermarket'},
  ]);

  await knex('status').insert([
    {id: 1, name: 'approve'},
    {id: 2, name: 'pending'},
    {id: 3, name: 'deny'}
  ]);
});*/

module.exports = knex;