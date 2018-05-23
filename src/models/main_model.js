'use strict';


const knex = require('../config/knex');


// This is the main Model that is inherited by all other models
class MainModel {
	constructor (tableName) {
		this.tableName = tableName;
	}


	create (data) {
		data.created_at = data.created_at || new Date();
		return knex(this.tableName).insert(data).returning('*')
			.then((result) => result[0])
			.catch((e) => {
				console.log('error');
				console.log(e.message);
				console.log(e.message.indexOf('violates foreign key'));
				console.log(e.message.indexOf('violates not-null'));
				if (e.message.indexOf('violates not-null') >= 0) {
					const str = e.message;
					console.log(e.column);
					// console.log(str.split('"'));
				}
				console.log();
				console.log();
				console.log();
				console.log(e);
			});
	}


	findOne (id) {
		return knex(this.tableName).where({ id })
			.then((array) => {
				// In the event of no record found, we still return an empty object for consistency
				const result = array[0] ? array[0] : {};
				return result;
			});
	}


	// find the employment or education history for one freelancer
	findHistory (id) {
		return knex(this.tableName).where({ freelancer_id: id });
	}


	// find a single client or freelancer review
	findReview (id) {
		const mainColumns = [`${this.tableName}.*`];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as clients_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];

		const selectedColumns = mainColumns.concat(clientColumns, freelancerColumns, jobColumns);
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('clients as c', `${this.tableName}.client_id`, 'c.id')
			.innerJoin('freelancers as f', `${this.tableName}.freelancer_id`, 'f.id')
			.innerJoin('jobs as j', `${this.tableName}.job_id`, 'j.id')
			.then((result) => result[0]);
	}


	// TODO: add boom errors for not found, doesn't currently give any indication other than an empty object
	updateById (id, data) {
		data.updated_at = new Date();
		return knex(this.tableName).where({ id }).update(data).returning('*')
			.then((result) => result[0]);
	}


	// TODO: test cascading delete (ex: delete a client, does that client's job dissappear as well?)
	// TODO: setup Boom to deal with not found cases (doesn't error out, simply returns a 0)
	delete (id) {
		return knex(this.tableName).where({ id }).del()
			// temporary, returns 1 if successful or 0 if not found
			.then((result) => result);
	}


}

module.exports = MainModel;
