'use strict';


//This file is modeled after the create-database file but only affects the test database. Mainly created and used for circleci
require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
connectionOptions.connection.database = 'postgres';
connectionOptions.pool.afterCreate = (conn, done) => {
	console.log('inside');
	conn.query('SELECT current_database();', (err) => {
		if (err) {
			console.log('error? --------------------------------------------------------------------------------------------------------------------------------------------');
			console.log(err);
			done();
		} else {
			console.log('good !!!!!!!!!!!!!');
			done();
		}
	})
}

const knex = require('knex')(connectionOptions);
console.log('New connection to default postgres database made');
console.log();
console.log();
// console.log(knex.client);
console.log();
console.log();

// Remove all other connections to test database
console.log('start');
knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_TEST_DATABASE}'`)
	.then(() => {
		console.log('Removed all other connections to the test database');
		// Drop test database if it exists
		return knex.raw(`DROP DATABASE IF EXISTS ${process.env.PG_TEST_DATABASE};`);
	})
	.then(() => {
		console.log('Dropped test database (if it existed)');
		// Create test database
		return knex.raw(`CREATE DATABASE ${process.env.PG_TEST_DATABASE};`);
	})
	.then(() => {
		console.log('Test database created');
		return process.exit();
	});
