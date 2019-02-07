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
To start the react server in production mode, run this command instead
```
npm run build
```

## Overall Directory
To be updated....

## Testing
To be updated....
```
npm test
```
Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# Review the below code and see what you want to keep







### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Need to Clean This file up

## General Info
For file structure for the client/src directory, I grouped the different files (js, css, etc.) by feature/component for the most pair, and only the files containing react component have their file names in pascal case (ex: HeaderNav)
