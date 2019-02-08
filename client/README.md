# Front End React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# About
This is the front end part of the app, currently built with React. In order to be a single page app, it utilizes react-routing.

## Getting Started
These steps are to get the frontend server started, If you follow the steps detailed in the root directory's README, this section is already covered.

You need to follow the steps in root directory README, to get the express server running on one terminal, then open another terminal to run the react server. Just like for the main directory, you need to create a '.env' file in client project directory. Model it after the .env.example file.

Next, setup the project by running the following command to install the node modules.

```
npm install
```

Now, you can run the server in development mode with the following command. The server starts on port 3000 by default. If the express server isn't started, you won't be able to grab any data from the back end.
```
npm start
```

To start the react server in production mode, run this command instead. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
```
npm run build
```

## Overall Directory
The project directory is broken down into a few key sub directories listed below.
* **public** - This is the index.html page that servers as the template for the react app.
* **src** - This contains the Javascript/React code for the client directory. 

## Testing
To be updated....
```
npm test
```
Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## General Info
For file structure of the client/src directory, I grouped the different files (js, css, etc.) by feature/component for the most part. Only the files containing react component have their file names in pascal case (ex: HeaderNav), everything else is lowercase.


## Learn More About React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
