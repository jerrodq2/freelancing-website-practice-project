'use strict';
//
//
// const React = require('react'),
// 	ReactDOM = require('react-dom'),
// 	App = require('./components/App');
//
//
// ReactDOM.render(
// 	<App />,
// 	document.getElementById('app')
// );


import React from 'react';
import ReactDOM from 'react-dom';


const App = () => {
  return <div>Hello World</div>
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
