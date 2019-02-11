import React, { Component } from 'react';
import Header from '../UI/Navbar';
import Jobs from '../jobs/Jobs';
import Freelancers from '../freelancers/Freelancers';
import Login from '../login/Login';
import SignUp from '../login/SignUp';
import {
  Route,
  HashRouter,
	Redirect,
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
			// this defines our routing region for react-router, putting it here, wraps the entire front end app in it
			<HashRouter>
				<div id="app_body">
					<Header />

					<div className="container">

						<Route exact path="/jobs" component={Jobs}/>
						<Route exact path="/freelancers" component={Freelancers}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/sign_up" component={SignUp}/>

						<Redirect from="/" to="/jobs" />
					</div>

				</div>
			</HashRouter>
		);
	}
}

export default App;
