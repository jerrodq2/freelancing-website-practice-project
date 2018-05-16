# freelancing-website-practice-project
Created 02/27/2018

# About
A freelancing website based off of the concepts of sites such as upwork. This is a practice project, it is not intended to become an in production website. The technologies used are Node.js with Express.js for the backend, Postgres for the database, and ReactJS for the starting front end. The starting focus of this project is on code quality, enforcing code standards with ESLint, connecting Node.js with React.js, unit testing, stronger github practices, and continous integration via Circleci.

## Getting Started
You need Node.js, nodemon, and postgres installed to use this project locally.

To get started, you need to create a '.env' file in the main project directory. Model it after the .env.example file, simply create necessary variables for your database and starting admin.

Next, setup the project by running the following command to install the node modules, create the main and test db, run migrations and seed data.
```
npm run init
```

You can also reset the database back to it's start state with migrations and seed data with the following command.
```
npm run db:reset
```

You can run the project with the following command.
```
npm run server
```
## Testing


## General Info

Last updated: 5/16/18
