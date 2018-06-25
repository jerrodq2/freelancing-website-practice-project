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


	// TODO: Any errors for giving a bad freelancer_id? Or one not belonging to an actual freelancer in the db? currently gives no error since it is just part of a where statement as opposed to a findOne on freelancers
	// find the employment or education history for one freelancer
	findHistory (id) {
		return knex(this.tableName).where({ freelancer_id: id })
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find history for');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
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
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'update');

				// throw error if a foreign key constraint was violated
				if (Errors.violatesForeignKey(err))
					throw Errors.badForeignKey(toSingular(this.tableName), 'update', findColumn(err.constraint, this.tableName));

				// throw error if a unique constraint was violated
				if (Errors.violatesUnique(err))
					throw Errors.badUnique(toSingular(this.tableName), 'update', findColumn(err.constraint, this.tableName));

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
