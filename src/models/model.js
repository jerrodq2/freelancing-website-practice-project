'use strict';


const knex = require('../config/knex');


class Model {
	constructor (tableName) {
		this.tableName = tableName;
	}

	findOne (id) {
		return knex(this.tableName).where({ id })
			.then((result) => {
				return result[0];
			});
	}

	
}

module.exports = Model;
