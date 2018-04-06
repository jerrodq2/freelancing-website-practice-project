'use strict';


const bcrypt = require('bcrypt');


const hashPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};


module.exports = {
	hashPassword,
};
