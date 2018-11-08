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

const e = React.createElement;

// const App = () => {
// 	return <div>Hello World</div>
// };

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		if (this.state.liked) {
			return 'You liked this';
		}

		return e(
			'button',
			{ onClick: () => this.setState({ liked: true }) },
			'Like'
		);
	}
}
// ReactDOM.render(
// 	<App />,
// 	document.querySelector('#app')
// );

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(App), domContainer);
