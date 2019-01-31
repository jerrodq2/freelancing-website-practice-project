'use strict';


const { celebrate, Joi } = require('celebrate');


// this file is an example of a get route with Joi validations
module.exports = (router) => router.get('/user_client/:id',
	celebrate({
		params: Joi.object().keys({
			id: Joi.string().guid().required().min(1),
		})
	}), (req, res) => {
		console.log('req = ', req.params);
		return res.status(200).send({ message: 'User router here' });
	}
);
