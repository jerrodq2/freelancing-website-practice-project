'use strict';


const { celebrate, Joi } = require('celebrate'),
	Clients = require('../../models/clients.js');


// this file is an example of a get route with Joi validations
module.exports = (router) => router.get('/user_client/:id',
	celebrate({
		params: Joi.object().keys({
			id: Joi.string().guid().required().min(1),
		})
	}), async (req, res) => {
		console.log('req.params = ', req.params);

		const client = await Clients.findOne(req.params.id);
		console.log('client found: ', client);

		return res.status(200).send({ message: 'User router here' });
	}
);
