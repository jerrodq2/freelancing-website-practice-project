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


	// find the employment or education history for one freelancer
	findHistory (id) {
		return knex(name).where({ freelancer_id: id });
	}


	// find a single client or freelancer review
	findReview (id) {
		const mainColumns = [`${name}.*`];
		const clientColumns = ['c.first_name as client_first_name', 'c.last_name as clients_last_name'];
		const freelancerColumns = ['f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const jobColumns = ['j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];

		const selectedColumns = mainColumns.concat(clientColumns, freelancerColumns, jobColumns);
		return knex(name)
			.select(selectedColumns)
			.where(knex.raw(`${name}.id = '${id}'`))
			.innerJoin('clients as c', `${name}.client_id`, 'c.id')
			.innerJoin('freelancers as f', `${name}.freelancer_id`, 'f.id')
			.innerJoin('jobs as j', `${name}.job_id`, 'j.id')
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
