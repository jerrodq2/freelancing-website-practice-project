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
	* Why: I use it to allow the use of environment variables throughout the project, variables that you set in a .env file, are hidden but can still be used throughout the project.
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
	* Name: "knex": "^0.14.4"
	* Why: I use to knex for query building, better structure, clean code and to manage my migrations and seeds.
	* Where: Like pg above, it is the backbone of my project, anywhere the database is touched knex is there. But it is heavily used in migrations, seeds, the models, and setting up/configuring the database.
	* Other: I have special files dedicated to setting up and configuring knex/pg/posgres, such as the knexfile in the main directory, the config folder in src/config, and database folder in bin/database

* **eslint** - a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
	* Name: "eslint": "^4.18.1"
	* Why: To enforce code standards, similar to JSLint but I can specify and customize the rules.
	* Where: Used throughout the entire project in the background as I work
	* Other: I setup the rules in the .eslintrc.json file

* **eslint-plugin-react** - N/A
	* Name: "eslint-plugin-react": "^7.7.0"
	* Why: N/A
	* Where: N/A
	* Other: N/A






* **code** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A

* **lab** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A

* **boom** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A

* **chance** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A



* **bcrypt** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A

* **better-npm-run** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A





* **date-fns** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A

* **lodash** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A



* **pluralize** - Info
	* Name: nameAndVersion
	* Why: why
	* Where: where
	* Other: N/A
