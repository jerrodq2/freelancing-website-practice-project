'use strict';


// This file is used in the db:reset npm script. It creates the main and test databases used in the project. This can be used to drop and then re-create them or create them from scratch. The below code assumes that the databases don't currently exists. Therefore, we start by connecting to the default empty postgres database so we can make queries without any errors
require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
// Change database in connection to default 'postgres' db
connectionOptions.connection.database = 'postgres';


const knex = require('knex')(connectionOptions);
console.log('New connection to default postgres database made');


// Remove all other connections to main database
knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_DATABASE}'`)
	.then(() => {
		// Drop main database if it exists
		return knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_DATABASE};`);
	})
	.then(() => {
		// Create main database
		return knex.raw(`CREATE DATABASE ${process.env.PG_DATABASE};`);
	})
	.then(() => {
		console.log('Main database created');
		// Remove all other connections to test database
		return knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_TEST_DATABASE}'`)
	})
	.then(() => {
		// Drop test database if it exists
		return knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_TEST_DATABASE};`);
	})
	.then(() => {
		// Create test database
		return knex.raw(`CREATE DATABASE ${process.env.PG_TEST_DATABASE};`);
	})
	.then(() => {
		console.log('Test database created');
		return process.exit();
	})
