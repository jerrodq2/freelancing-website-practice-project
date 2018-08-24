'use strict';


const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
const knex = require('knex')(connectionOptions);
const random = require(`${process.cwd()}/randoms`);
const _ = require('lodash');
const checkErr = require('./lib/error_methods');


const helpers = {
	knex,
	random,
	checkErr,
	_,

	db: {
		// clears all of the tables in the test db
		resetAll: async () => {
			// the two tables we don't want to reset
			const blacklist = ['_migrations', '_migrations_lock'];
			// creates an object, which has an array containing all of the tables we want to reset
			const allTables = await knex.raw('SELECT tablename FROM pg_tables WHERE schemaname=\'public\';');

			// we take allTables and turn it into just an array of table names (map), and we remove the blacklisted tables (filter)
			const tables = allTables.rows.map((row) => row.tablename).filter((index) => blacklist.indexOf(index) === -1);

			// truncate all tables in the tables array
			return knex.raw(`TRUNCATE ${[].concat(tables).join(',')} CASCADE`);
		},

		// resets specific tables in the test db
		resetTable: (table) => {
			return knex.raw(`TRUNCATE ${table} CASCADE;`);
		},
	},


};


module.exports = helpers;
