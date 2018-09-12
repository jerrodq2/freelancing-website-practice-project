'use strict';


module.exports = (router) => {

	router.get('/user', (req, res) => {
		res.status(200).send({
			message: 'User router here',
		});
	});

};
