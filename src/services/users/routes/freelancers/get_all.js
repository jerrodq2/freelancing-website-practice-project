'use strict';


const { celebrate, Joi } = require('celebrate'),
	Freelancers = require('../../models/freelancers.js');


// this file is an example of a get route with Joi validations
module.exports = (router) => router.get('/freelancers/',
	celebrate({
		query: {
			// token: Joi.string().token().required()
		}
	}), async (req, res) => {
		console.log('params = ', req.params);
		console.log('query = ', req.query);

		const freelancers = await Freelancers.getAll();
		console.log('freelancers =', freelancers);
		return res.status(200).send(freelancers);
	}
);
