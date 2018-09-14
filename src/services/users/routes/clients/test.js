'use strict';


const { celebrate, Joi, errors } = require('celebrate');


module.exports = (router) => router.get('/user_client',
	celebrate({
		body: Joi.object().keys({

		}),
		query: {

		}
	}), (req, res) => {
		return res.status(200).send({ message: 'User router here' });
	}
);
