'use strict';


const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular, findColumn } = require(`${process.cwd()}/src/lib/helper_functions`);


// This is the main Model that is inherited by all other models
class MainModel {
	constructor (tableName) {
		this.tableName = tableName;
	}


	create (data) {
		data.created_at = data.created_at || new Date();
		return knex(this.tableName).insert(data).returning('*')
			.then((result) => result[0])
			.catch((err) => {
				// throw error if a not-null constraint was violated
				if (Errors.violatesNull(err))
					throw Errors.badNull(toSingular(this.tableName), 'create', err.column);

				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'create');

				// throw error if a foreign key constraint was violated
				if (Errors.violatesForeignKey(err))
					throw Errors.badForeignKey(toSingular(this.tableName), 'create', findColumn(err.constraint, this.tableName));

				// throw error if a unique constraint was violated
				if (Errors.violatesUnique(err))
					throw Errors.badUnique(toSingular(this.tableName), 'create', findColumn(err.constraint, this.tableName));

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


	findOne (id) {
		return knex(this.tableName).where({ id })
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


	// TODO: Add errors for not found and bad id syntax
	// find the employment or education history for one freelancer
	findHistory (id) {
		return knex(this.tableName).where({ freelancer_id: id });
	}


	// TODO: Add errors for not found and bad id syntax
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


	updateById (id, data) {
		data.updated_at = new Date();
		return knex(this.tableName).where({ id }).update(data).returning('*')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'update');

				return result[0];
			})
			.catch((err) => {
				// throw error if a not-null constraint was violated
				if (Errors.violatesNull(err))
					throw Errors.badRequest(toSingular(this.tableName), 'update', err.column);

				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err)) {
					throw Errors.badId(toSingular(this.tableName), 'update');
				}

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


	delete (id) {
		return knex(this.tableName).where({ id }).del()
			// By default, it returns 1 if successful and 2 if not found. I changed this to return true and false respectively, just preference
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result) throw Errors.notFound(toSingular(this.tableName), 'delete');

				return true;
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'delete');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


}

module.exports = MainModel;
