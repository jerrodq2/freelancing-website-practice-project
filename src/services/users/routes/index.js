'use strict';


// This file gathers all of the user routes and exports them to the main routes file in src/services/routes
module.exports = (router) => {

	// '/user_client/:id' - example of a get route with Joi
	require('./clients/test_get.js')(router);
	// '/post' - example of a post route with Joi
	require('./clients/test_post.js')(router);
};
