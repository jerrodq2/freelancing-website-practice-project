'use strict';


//This file is modeled after the create-database file but only affects the test database. Mainly created and used for circleci
require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
// Change database in connection to default 'postgres' db
connectionOptions.connection.database = 'postgres';


// I put the setting up database code into a function so I can control all of the async code, including the require statement which seemed to give me some trouble
const SetUpTestDB = async () => {
	const knex = await require('knex')(connectionOptions);
	console.log('New connection to default postgres database made');

	// Remove all other connections to test database
	await knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_TEST_DATABASE}'`)
		.catch((err) => {
			console.log('there was an error!!!!!!!!!!!');
			console.log(err);
			return;
		})
	console.log('Removed all other connections to the test database');

	// Drop test database if it exists
	await knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_TEST_DATABASE};`);
	console.log('Dropped test database (if it existed)');

	// Create test database
	await knex.raw(`CREATE DATABASE ${process.env.PG_TEST_DATABASE};`);
	console.log('Test database created');
};


SetUpTestDB()
	.then(() => process.exit());
