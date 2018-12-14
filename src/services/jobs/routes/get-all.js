'use strict';


const { celebrate, Joi } = require('celebrate'),
	Jobs = require('../models/jobs.js');


// this file is an example of a get route with Joi validations
module.exports = (router) => router.get('/jobs/',
	celebrate({
		query: {
			// token: Joi.string().token().required()
		}
	}), async (req, res) => {
		console.log('hi?');
		console.log('params = ', req.params);
		console.log('query = ', req.query);

		const jobs = await Jobs.getAll();
		console.log('jobs =', jobs);
		return res.status(200).send(jobs);
	}
);
