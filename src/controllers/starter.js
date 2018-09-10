'use strict';


module.exports = {
	test: (req, res) => {
		return res.status(200).send({
			message: 'Welcome to the beginning of nothingness.',
		});
	}
};
