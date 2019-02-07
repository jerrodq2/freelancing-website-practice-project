# freelancing-website-practice-project
Created 02/27/2018

# About
A freelancing website based off of the concepts of sites such as upwork. This is a practice project, it is not intended to become an in production website. The technologies used are Node.js with Express.js for the backend, Postgres for the database, and ReactJS for the front end. The starting focus of this project is on code quality, enforcing code standards with ESLint, connecting Node.js with React.js, unit testing, stronger github practices, and continous integration via Circleci. Currently, it is designed to run on two different servers/ports, the backend (express) runs on one, and the frontend (react) runs on another.

## Getting Started
You need Node.js, nodemon, npm, and postgres installed on your system to use this project locally. These steps gets the backend server running, you also need to follow the steps detailed in client/README to get the frontend server started.

To get started, you need to create a '.env' file in the main project directory. Model it after the .env.example file, simply create necessary variables for your database and starting admin.

Next, setup the project by running the following command to install the node modules in the main directory, create the main and test db, run migrations and seed data, and then install the node modules for react in the /client directory.
```
npm run setup
```

Once that is done, you can start the express server with the following command. The server starts on the port specified in the .env file or 5000 if not specified, it also displays the port it is on, and the server side endpoints to the terminal on start up, just something I like.
```
npm run server
```

Next, open a second terminal, navigate to the client directory, and start the react server in development mode with the following command. The react server starts on port 3000 by default.
```
npm start
```
To start the react server in production mode, run this command instead
```
npm run build
```

All Setup! Now navigate to http://localhost:3000/ to see the project.

Another useful script is below, with it you can reset the database back to it's starting state with migrations and seed data at any time.
```
npm run db:reset
```


## Overall Directory
The project is directory is broken down into a few key sub directories listed below.
* **.circleci** - Used by CircleCi
* **.github** - Used by github, contains PR template
* **bin** - Contains executable scripts, such as the scripts to create the database and initial admin
* **info** - This is only used for information purposes. Gives a more detailed explanations about the db, tables, and npm modules used in this project, for understanding and a refresher incase I or anyone else needs it
* **logs** - This folder is where logs from bunyan are sent. In the event of bunyan logging something, it creates a file and puts it in the logs folder. All log files are ignored by git by default
* **migrations** - The migrations files used by knex to structure the databases
* **client** -This is the client facing directory, which houses the React app.
* **randoms** - Contains my custom mixins for the Chance module
* **seeds** - Used by knex to populate the database via scripts
* **src** - This is the back end code, knex options, services, lib, etc.
* **test** - This is the test directory, meant to mirror the main directory and the applicable folders, so it has a sub src and client directory


## Testing
This project uses npm Lab and Code to run its server side tests. Other npm modules used include Chance. It uses a separate test database, that mirrors the main database, using the same migrations without the seed data.

My current practice with this project is to test all Models. I also try to test the intended behavior as well as what is not intended, or what should make it fail. I try to find a balance between being thorough but not overly tedious. You can run all of the tests with the following command.
```
npm run test
```

## General Info
You can see more detailed information about both the database and npm modules I use in this project in the info folder.

I also add comments to the top of all files as a general description of the file, this servers as a reminder to myself and makes it easier for someone else to understand the purpose of the file without having to go through all of the code.

A note about the general syntax of the project. I prefer to add spaces throughout the project for readability and to make things clearer, just a preference. I also added comments throughout the project, both for the understanding of anyone who isn't familiar with the project and for myself when I inevitably come back to this code weeks/months later and don't remember what I wrote.

For info on the React part of this project, go to the client/README file

Last updated: 2/7/19
