'use strict';


const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
const knex = require('knex')(connectionOptions);
const random = require(`${process.cwd()}/randoms`);
const _ = require('lodash');
const checkErr = require('./lib/error_methods');


// TODO: Look into more elegant solution to clear/truncate all tables from db besides a hard coded array.
const pgTables = [
	'admins',
	'client_reviews',
	'clients',
	'education_history',
	'employment_history',
	'fields',
	'flagged_client_reviews',
	'flagged_clients',
	'flagged_freelancer_reviews',
	'flagged_freelancers',
	'flagged_invitations',
	'flagged_jobs',
	'flagged_proposals',
	'freelancer_reviews',
	'freelancer_skills',
	'freelancers',
	'invitations',
	'job_activity',
	'jobs',
	'proposals',
	'saved_clients',
	'saved_freelancers',
	'saved_jobs',
	'skills',
];


const helpers = {
	knex,
	random,
	checkErr,
	_,

	db: {
		// clears all of the tables in the test db
		resetAll: () => {
			const queries = [];
			pgTables.forEach((table) => queries.push(knex.raw(`TRUNCATE ${table} CASCADE;`)));

			return Promise.all(queries);
		},
		// clears specific table in db
		resetTable: (table) => {
			return knex.raw(`TRUNCATE ${table} CASCADE;`);
		},
	},


};


module.exports = helpers;
