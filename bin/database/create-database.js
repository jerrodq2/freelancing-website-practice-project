'use strict';

//The below code assumes that the main database doesn't currently exists. Therefore, we start by connecting to the default empty postgres database so we can make queries without any errors
require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/src/config/knex-connection-options.js`);

connectionOptions.connection.database = 'postgres';


const knex = require('knex')(connectionOptions);

console.log('New connection to default postgres database made');


console.log('Terminating all other current connections to main database...');
console.log('!!!!!!!!!!!!', ` ${process.env.PG_DATABASE}`);
knex.raw(`select pg_terminate_backend(pid) from pg_stat_activity where datname = '${process.env.PG_DATABASE}'`)
	.then(() => {
		console.log('Connections Terminated');

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
