'use strict';


const Model = require(`${process.cwd()}/src/services/main_model`);
const Fields = new Model('fields');


module.exports = {

	getAll () {
		// TODO: determine if this is necessary
	},

	create (data) {
		return Fields.create(data);
	},

	findOne (id) {
		return Fields.findOne(id);
	},

	update (id, data) {
		return Fields.updateById(id, data);
	},

	delete (id) {
		return Fields.delete(id);
	}

};
