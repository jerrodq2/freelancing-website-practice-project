'use strict';

// This file gets the options to connect to the database via knex. Gets slightly different options depending on the node environment. Any file other than create-database.js, goes through this file to connect to postgres and use knex.
const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
console.log('test');
const knex = require('knex')(connectionOptions);


module.exports = knex;
