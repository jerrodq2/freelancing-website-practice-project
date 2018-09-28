'use strict';


// This file defines the options to connect to knex used throughout the project, for both normal and test database. It is required by the knexfile in the main directory, which all other files go through.
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
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: '_migrations',
		directory: './migrations',
	},
	seeds: {
		directory: './seeds/development'
	}
};

const testOptions = JSON.parse(JSON.stringify(connectionOptions));

testOptions.connection.database = process.env.PG_TEST_DATABASE;


module.exports = {
	connectionOptions,
	testOptions,
};
