'use strict';

//Specifies connection options for knex
const connectionOptions = {
	client: 'pg',
	version: '7.4.1',
	connection: {
		host: '127.0.0.1',
		user: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
		port: parseInt(process.env.PG_PORT) || 5432
	},

	//The bottom code is to be added in later
	// migrations: {
	// 	tableName: '_migrations',
	// 	directory: './migrations',
	// }
};

const knex = require('knex')(connectionOptions);
module.exports = knex;
