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
		const selectedColumns = [`${name}.*`, 'fields.field'];
		return knex(name)
			.select(selectedColumns)
			.where(knex.raw(`${name}.id = '${id}'`))
			.innerJoin('fields', `${name}.field_id`, 'fields.id')
			.then((result) => result[0]);
	}

	// find one for any table other than client or freelancer
	findOne (id) {
		return knex(name).where({ id })
			.then((result) => result[0]);
	}

	create (data) {
		data.created_at = data.created_at || new Date();
		return knex(name).insert(data).returning('*')
			.then((result) => result[0]);
	}

	// add boom errors for not found, doesn't currently give any indication other than an empty object
	updateById (id, data) {
		data.updated_at = new Date();
		return knex(name).where({ id }).update(data).returning('*')
			.then((result) => result[0]);
	}
	
	// test cascading delete (ex: delete a client, does that client's job dissappear as well?)
	// setup Boom to deal with not found cases (doesn't error out, simply returns a 0)
	delete (id) {
		return knex(name).where({ id }).del()
			// temporary, returns 1 if successful or 0 if not found
			.then((result) => result);
	}


}

module.exports = Model;
