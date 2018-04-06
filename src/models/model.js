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
			.then((result) => result[0]);
	}

	create (data) {
		data.created_at = data.created_at || new Date();
		return knex(name).insert(data).returning('*')
			.then((result) => result[0]);
	}

	updateById (id, data) {
		data.updated_at = new Date();
		return knex(name).where({ id }).update(data).returning('*')
			.then((result) => result[0]);
	}
	// test cascading delete (ex: delete a client, does that client's job dissappear as well?)
	// setup Boom to deal with not found cases (doesn't error out, simply returns a 0)
	delete (id) {
		return knex(name).where({ id }).del();
	}


}

module.exports = Model;
