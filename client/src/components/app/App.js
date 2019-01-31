import React, { Component } from 'react';
import Header from '../UI/Navbar';
import JobSearch from '../jobs/JobSearch'
import TestClient from '../jobs/TestClient'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import './app.css'


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
						<p><NavLink to="/jobsearch">Job Search</NavLink></p>
						<p><NavLink to="/client">Client</NavLink></p>

						<Route path="/jobsearch" component={JobSearch}/>
						<Route path="/client" component={TestClient}/>
					</div>

				</div>
			</HashRouter>
		);
	}
}

export default App;
