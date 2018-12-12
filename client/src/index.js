// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';


// class LikeButton extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = { liked: false };
// 	}
//
// 	render() {
// 		if (this.state.liked) {
// 			return (
// 				<button onClick={() => this.setState({ liked: false })}>
// 			    You liked this
// 			  </button>
// 			);
// 		}
//
// 		return (
// 		  <button onClick={() => this.setState({ liked: true })}>
// 		    Like
// 		  </button>
// 		);
// 	}
// }


ReactDOM.render(
    <App />,
    document.getElementById("root"),
);
