'use strict';


require('dotenv').config();

const { testOptions } = require(`${process.cwd()}/src/config/knex-connection-options.js`);

// Connect to test database
require('knex')(testOptions);
