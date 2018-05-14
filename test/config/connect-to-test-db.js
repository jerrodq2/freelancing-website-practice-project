'use strict';


require('dotenv').config();

const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];

// Connect to test database
require('knex')(connectionOptions);
