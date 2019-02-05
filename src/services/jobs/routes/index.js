'use strict';


// This file gathers all of the job routes and exports them to the main routes file in src/services/routes
module.exports = (router) => {

	// '/jobs' - get all route for jobs
	require('./jobs/get_all.js')(router);
};
