'use strict';


module.exports = (router) => {

	// '/user_client'
	require('./clients/test_get.js')(router);
	// '/post'
	require('./clients/test_post.js')(router);
};
