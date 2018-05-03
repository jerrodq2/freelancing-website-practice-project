'use strict';


const Model = require('./model');
const Fields = new Model('fields');


module.exports = {

	getAll () {
		// TODO: determine if this is necessary
	},

	findOne (id) {
		return Fields.findOne(id);
	},

	create (data) {
		return Fields.create(data);
	},

	update (id, data) {
		return Fields.updateById(id, data);
	},

	delete (id) {
		return Fields.delete(id);
	}

};
