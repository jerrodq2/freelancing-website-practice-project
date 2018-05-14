'use strict';

//Specifies connection options for knex
const { connectionOptions } = require('./knex-connection-options.js');
const knex = require('knex')(connectionOptions);

module.exports = knex;
