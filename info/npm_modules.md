# This file explains the basic purpose of the node modules I have installed in the project, what they do, and why/how I use them

Example Bullet: Just demonstrating the format for the below modules
* **Module_name** - Basic description
	* Name: Actual name of package and version number as it's listed in the package.json
	* Why: Why I use the package
	* Where: Where the package is used, ex: in the models, tests, routes, etc.
	* Other: Other useful info to know



## Node Modules
Below are the individual npm modules/packages I have installed in the project, short description about them, why I have them, and how I use them

* **dotenv** - A zero-dependency module that loads environment variables from a .env file into process.env.
	* Name: "dotenv": "^5.0.1"
	* Why: I use it to allow the use of environment variables throughout the project, variables that you set in a .env file, are hidden from users but can still be used throughout the project, ex: database password
	* Where: I use throughout the project, but mainly with scripts and database work currently.
	* Other: N/A

* **express** - Fast, minimalist web framework for node
	* Name: "express": "^4.16.2"
	* Why: Express serves as my framework for the node environment
	* Where: it's basically the entire backend project, but I set it up in the index.js file
	* Other: N/A

* **body-parser** - N/A
	* Name: N/A
	* Why: N/A
	* Where: N/A
	* Other: N/A

* **pg** - Non-blocking PostgreSQL client for Node.js
	* Name: "pg": "^7.4.1"
	* Why: I use it as a client to connect my project to PostgreSQL
	* Where: It is part of the backbone of my project and is used anywhere the database is involved
	* Other: I have special files dedicated to setting up my connection to postgres, though they all go through the knex module below.

* **knex** - A batteries-included, multi-dialect (MSSQL, MySQL, PostgreSQL, SQLite3, Oracle(including Oracle Wallet Authentication), WebSQL) query builder for Node.js and the Browser.
	* Name: "knex": "^0.15.2"
	* Why: I use to knex for query building, better structure, clean code and to manage my migrations and seeds. It acts as the middle man between my project and knex, I give it the connection options and it connects me to the db (postgres in this case)
	* Where: Like pg above, it is the backbone of my project, anywhere the database is touched knex is there. But it is heavily used in migrations, seeds, the models, and setting up/configuring the database.
	* Other: I have special files dedicated to setting up and configuring knex/pg/postgres, such as the knexfile in the main directory, the config folder in src/config, and database folder in bin/database

* **eslint** - a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
	* Name: "eslint": "^4.18.1"
	* Why: To enforce code standards, similar to JSLint but I can specify and customize the rules. For example, in my project, it will give me a lint error if I don't have spaces after the starting curly bracket and before the last one in an object. Ex: {hi} gives a lint error, { hi } doesn't
	* Where: Used throughout the entire project in the background as I work
	* Other: I setup the rules in the .eslintrc.json file

* **eslint-plugin-react** - N/A
	* Name: "eslint-plugin-react": "^7.7.0"
	* Why: N/A
	* Where: N/A
	* Other: N/A

* **date-fns** - provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates in a browser & Node.js
	* Name: "date-fns": "^1.29.0"
	* Why: I use it to manipulate and format dates.
	* Where: currently only used in seeds and models
	* Other: N/A

* **lodash** - A modern JavaScript utility library delivering modularity, performance, & extras.
	* Name: "lodash": "^4.17.5"
	* Why: I use lodash for it's helpful methods, such as omitting certain keys in an object with .omit
	* Where: currently is is used in the models and tests
	* Other: N/A

* **pluralize** - package used to pluralize and singularize any word.
	* Name: "pluralize": "^7.0.0"
	* Why: Simply used in my error messages to make table plural or singular
	* Where: currently only used in the src/lib/helper functions and throughout my models
	* Other: N/A

* **bcrypt** - Used to hash passwords
	* Name: "bcrypt": "^3.0.1"
	* Why: hash my user passwords
	* Where: in the models
	* Other: N/A

* **better-npm-run** - Better NPM scripts runner, allows more complex writing of your scripts
	* Name: "better-npm-run": "^0.1.0"
	* Why: it allows the use of basically abstracting your scripts into smaller more re-usable scripts.
	* Where: package.json
	* Other: N/A

* **code** - BDD assertion library.
	* Name: "code": "^5.2.0"
	* Why: Allows the use of statements like 'expect' to test my code
	* Where: test directory
	* Other: N/A

* **lab** - Node test utility
	* Name: "lab": "^15.3.1"
	* Why: Allows the testing of my code
	* Where: test directory
	* Other: N/A

* **boom** - HTTP-friendly error objects
	* Name: "boom": "^7.2.0"
	* Why: Allows me to manipulate errors and return http friendly error objects with customized messages. For example, returning a 404 status code with a specific message if a findOne method in my models didn't find anything.
	* Where: used throughout the project, but created in the src/lib/errors file
	* Other: N/A

* **chance** - Random generator helper for JavaScript
	* Name: "chance": "^1.0.16"
	* Why: I use it to create random things, ex: random name, word, paragraph, mainly used in testing.
	* Where: test and randoms directory
	* Other: the randoms directory is dedicated to this module and my own custom mixins/methods for it

* **celebrate** - an express middleware function that wraps the joi validation library.
	* Name: "celebrate": "^8.0.2"
	* Why: I use it to utilize the Joi validation library, which I use to validate my server side routes. Joi is normally used with the Hapi node framework, celebrate allows you to use it with express.
	* Where: server side routes
	* Other: n/a

* **cors** - a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. 
	* Name: "cors": "^2.8.5"
	* Why: I use it to allow my React server to make get/post requests. This is necessary due to it being on a different server, and thus being form a different origin
	* Where: server side routes
	* Other: n/a
