'use strict';

//The below code assumes that the main database doesn't currently exists. Therefore, we start by connecting to the default empty postgres database so we can make queries without any errors
require('dotenv').config();

const connectionOptions = {
	client: 'pg',
	version: '7.4.1',
	connection: {
		host: '127.0.0.1',
		user: process.env.PG_SUPER,
		password: process.env.PG_SUPER_PASSWORD,
		database: 'postgres',
		port: parseInt(process.env.PG_PORT) || 5432
	},
};


const knex = require('knex')(connectionOptions);
console.log('New connection to default postgres database made');

console.log('Terminating all other current connections to main database...');
knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_DATABASE}'`)

	.then(() => {
		return knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_DATABASE};`);
	})
	.then(() => {
		console.log('Old database dropped if existed');

		return knex.raw(`CREATE DATABASE ${process.env.PG_DATABASE};`);
	})
	.then(() => {
		console.log('Main database created');
		return process.exit();
	});
