'use strict';


const { celebrate, Joi } = require('celebrate');


// NOTE: this file is a joi example
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
		})
		// TODO: should I add info for these below?
		// .with('a', 'b');
	}), (req, res) => {
		return res.status(200).send('Post Successful');
	}
);

// NOTES ON Joi - maybe put in a word doc later - https://github.com/hapijs/joi/blob/master/API.md#objectorpeers
/*

.requied() - requires the key to be included in the req body, it is optional (see below) by default. Specifically, it doesn't allow a key to be undefined

.optional() - allows the key to be undefined, in other words to not be included in the req body. It is basically optional of being in the body. It doesn't affect what value is accepted beyond that. Meaning, if you have "name: Joi.string().optional();" and name is not in the req body, no problem. But if it is in the body and is blank (null), it will error out. Use .allow(value) if you want to allow it to be blank(null) or any other value. You can use both allow and optional together if desired, ex: allow the key to be in the body or not and then allow it to be blank or not. If that isn't the desired behavior, be specific about using optional or allow

.forbidden() - marks a key as forbidden, meaning it will only accept a value of undefined. In other words, if the key exists in the req body, it will error out.

.allow() - allows specific values for the key. For example, if you have "name: Joi.string().allow('');" then name will have to be in the body (look at optional() to allow it to be undefined), but it can also be blank (null). If allow was taken away, it wouldn't be allowed to blank. Multiple values can be specified

.valid() - only allows specific values. For example, if we have "age: Joi.number().required().valid(5, 6)", age will have to be in the body and it can only be 5 or 6, anything else will error out. Also accepts an array of values (ex: valid([5, 'hi', 8]); ).

.default() - sets a value if the key isn't in the body (undefined). If it is in the body, default doesn't affect it. It can also accept a function as a default. Be careful about using it with optional().

.trim() - removes any whitespace in a string before or after the value(ex: "name here   " becomes "name here")

.lowercase() - requries the string to be all lowercase, if the validation "convert" option is on (it is be default), the string will be forced to lowercase.

.uppercase() - same as lowercase() but makes it uppercase.

.string().guid() - requires the string to be in guid format

.string().regex() - requires a string to match the regex given, ex: "Joi.string().regex(/^[abc]+$/);". It also accepts variables, ex: "phone: Joi.string().trim().regex(PHONE_REGEX).optional(),"

.when() - a joi conditional, converts the key to an alternative based on the conditions. for example, if I have
"letter: Joi.string().when('b', { is: Joi.exist(), then: Joi.valid('y'), otherwise: Joi.valid('z') })"
then, if the key 'b' exists in the body, it changes the letter key to use .valid and only allow 'y'. But if 'b' doesn't exist in the body, it changes it to only allow 'z' to be valid. A more complicated example, say you have a 'type' key which can be 'dealer' or 'not dealer', and we have:
"dealerId: Joi.any().forbidden().when('type', { is: 'dealer', then: Joi.string().guid().required() })"
in this case, the 'dealerId' key is forbidden (can't be in the body) by default. But, if the 'type' key is equal to 'dealer', then it changes the 'dealerId' key be required and be in guid() format

*/

// module.exports = (router) => router.post('/post',
// 	(req, res) => {
// 		console.log(req.body);
// 		return res.status(200).send('Post Successful');
// 	}
// );
