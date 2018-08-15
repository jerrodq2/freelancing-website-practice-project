'use strict';


//This file is modeled after the create-database file but only affects the test database. Mainly created and used for circleci
require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
connectionOptions.connection.database = 'postgres';

const knex = require('knex')(connectionOptions);
console.log('New connection to default postgres database made');


return knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_TEST_DATABASE};`)
	.then(() => {
		console.log('Dropped test database (if it existed)');
		// Create test database
		return knex.raw(`CREATE DATABASE ${process.env.PG_TEST_DATABASE};`);
	})
	.then(() => {
		console.log('Test database created');
		return process.exit();
	});
