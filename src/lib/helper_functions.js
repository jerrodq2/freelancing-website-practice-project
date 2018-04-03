'use strict';


const bcrypt = require('bcrypt');


const hashFunc = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};


module.exports = {
	hashFunc,
};
