'use strict';
console.log();
console.log('CONNECTION OPTIONS!!!');
module.exports = {
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
