'use strict';

//Specifies connection options for knex
const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];

const knex = require('knex')(connectionOptions);


module.exports = knex;
