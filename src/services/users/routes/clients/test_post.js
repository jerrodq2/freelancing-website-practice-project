'use strict';


const { celebrate, Joi } = require('celebrate');


// this file is an example of a post route with Joi validations
module.exports = (router) => router.post('/post',
	celebrate({
		body: Joi.object().keys({
			// name must be in the body. trim() also removes any whitespace before or after (ex: "name here   " becomes "name here")
			name: Joi.string().trim().required(),

			// middle doesn't have to be in the body, but if it is, it can't be null
			middle: Joi.string().optional(),

			// last has to be in the body but it can be blank.
			last: Joi.string().required().allow(''),

			// nickname will default to 'none' if it isn't in the body (undefined). If it is in the body, default() won't affect it
			nickname: Joi.string().default('none'),

			// age has to be in the body, and be between 1 and 100, including them, so it can be 1 or 100 as well.
			age: Joi.number().required().min(1).max(100),

			// number has to be in the body, and it can only be 5 or 6, anything else will cause an error.
			number: Joi.number().required().valid(5, 6),

			// requires the id to in guid format if it is in the body. But since it is optional() it doesn't have to be in the body
			id: Joi.string().guid().optional(),

			// a Joi conditional. If the key 'name' (shown above) exists in the body, then the test key is required to be in the body. If the 'name' doesn't exist (isn't in the body), then the test key can be blank (null)
			test: Joi.string().allow('').when('name', { is: Joi.exist(), then: Joi.string().required(), otherwise: Joi.string().allow('') }),

			// using .with() at the end of the body keys({}) object requires the presence of other keys when the specificed key is here. Basically, if the 'a' key exists in the body, then the 'b' key is required. If 'a' isn't in the body, 'b' isn't required. Can accept more than one peer, ex: .with('a', ['b', 'c'])
		}).with('a', 'b')
	}), (req, res) => {
		return res.status(200).send('Post Successful');
	}
);
