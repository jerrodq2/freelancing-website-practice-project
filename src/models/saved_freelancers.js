'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const Saved_freelancers = new Model('saved_freelancers');


module.exports = {


	getAll () {
		// to be setup with pagination later
	},

	findOne (id) {
		const savedFreelancerColumns = ['saved_freelancers.*'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const selectedColumns = savedFreelancerColumns.concat(freelancerColumns, clientColumns);
		return knex('saved_freelancers')
			.select(selectedColumns)
			.where(knex.raw(`saved_freelancers.id = '${id}'`))
			.innerJoin('freelancers as f', 'saved_freelancers.freelancer_id', 'f.id')
			.innerJoin('client as c', 'saved_freelancers.client_id', 'c.id')
			.then((result) => result[0]);
	},

	create (data) {
		return Saved_freelancers.create(data);
	},

	update (id, data) {
		return Saved_freelancers.updateById(id, data);
	},

	delete (id) {
		return Saved_freelancers.delete(id);
	}

};
