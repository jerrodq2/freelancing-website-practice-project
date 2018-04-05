'use strict';


const knex = require('../config/knex');
let name;

class Model {
	constructor (tableName) {
		this.tableName = tableName;
		// less typing
		name = this.tableName;
	}
	// select a single client or freelancer, also grabs their field (front end, web development, etc.)
	findOneUser (id) {
		const columns = [`${name}.*`, 'fields.field'];
		return knex(name)
			.select(columns)
			.where(knex.raw(`${name}.id = '${id}'`))
			.innerJoin('fields', `${name}.field_id`, 'fields.id')
			.then((result) => {
				return result[0];
			});
	}


}

module.exports = Model;
