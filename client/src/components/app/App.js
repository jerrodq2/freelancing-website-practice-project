import React, { Component } from 'react';
import Header from '../UI/Navbar';
import Jobs from '../jobs/Jobs';
import Login from '../login/Login';
import SignUp from '../login/SignUp';
import TestClient from '../jobs/TestClient';
import {
  Route,
  HashRouter
} from "react-router-dom";
import './app.css';


class App extends Component {
	// do I want to use state to hold the data I retrieve?
	constructor(props) {
    super(props);

    this.state = {
      data: [],
    }
  }


	render() {
		return(
			// this defines our routing region for react-router
			<HashRouter>
				<div className="App">
					<Header />

					<div className="container">

						<Route exact path="/jobs" component={Jobs}/>
						<Route exact path="/client" component={TestClient}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/sign_up" component={SignUp}/>
					</div>

				</div>
			</HashRouter>
		);
	}
}

export default App;
