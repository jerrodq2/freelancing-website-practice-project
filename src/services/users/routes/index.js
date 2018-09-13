'use strict';


module.exports = (router) => {

	router.get('/user', require('./clients/test.js'));

};
