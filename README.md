# freelancing-website-practice-project
Created 02/27/2018

# About
A freelancing website based off of the concepts of sites such as upwork. This is a practice project, it is not intended to become an in production website. The technologies used are Node.js with Express.js for the backend, Postgres for the database, and ReactJS for the starting front end. The starting focus of this project is on code quality, enforcing code standards with ESLint, connecting Node.js with React.js, unit testing, stronger github practices, and continous integration via Circleci.

## Getting Started
You need Node.js, nodemon, npm, and postgres installed to use this project locally.

To get started, you need to create a '.env' file in the main project directory. Model it after the .env.example file, simply create necessary variables for your database and starting admin.

Next, setup the project by running the following command to install the node modules, create the main and test db, run migrations and seed data.
```
npm run init
```

You can also reset the database back to it's starting state with migrations and seed data with the following command.
```
npm run db:reset
```

You can run the project with the following command.
```
npm run server
```

## Overall Directory
The project is directory is broken down into a few key sub directories listed below.
* **.circleci** - Used by CircleCi
* **.github** - Used by github, contains PR template
* **bin** - Contains executable scripts, such as the scripts to create the database and initial admin
* **migrations** - The migrations files used by knex to structure the databases
* **public** -This is the client facing directory, contains front end code, templates, static files, etc.
* **randoms** - Contains my custom mixins for the Chance module
* **seeds** - Used by knex to populate the database via scripts
* **src** - This is the back end code, knex options, models, helper files, etc.
* **test** - This is the test directory, meant to mirror the main directory and the applicable folders, so it has a sub src and public directory
* **info** - This is only used for information purposes. Gives a more detailed explanations about the db, tables, and npm modules used in this project, for understanding and a refresher incase I or anyone else needs it


## Testing
This project uses npm Lab and Code to run its tests. Other npm modules used include Chance. It uses a separate test database, that mirrors the main database, using the same migrations without the seed data.

My current practice with this project is to test all Models. I also try to test the intended behavior as well as what is not intended, or what should make it fail. I try to find a balance between being thorough but not overly tedious. You can run all of the tests with the following command.
```
npm run test
```

## General Info
You can see more detailed information about both the database, and npm modules I use in this project in the info folder.

A note about the general syntax of the project. I prefer to add spaces throughout the project for readability and to make things clearer, just a preference. I also added comments throughout the project, both for the understanding of anyone who isn't familiar with the project and for myself when I inevitably come back to this code weeks later and don't remember what I wrote.

Last updated: 5/22/18
