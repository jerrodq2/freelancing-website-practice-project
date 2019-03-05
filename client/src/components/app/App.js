import React, { Component } from 'react';
import Header from '../UI/Navbar';
import Jobs from '../jobs/Jobs';
import Freelancers from '../freelancers/Freelancers';
import Login from '../login/Login';
import SignUp from '../login/SignUp';
import {
  Route,
  HashRouter,
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
						{/* for now, upon going to localhost, you are brought to '/' which is a blank page, make home page later */}
						<Route exact path="/jobs" component={Jobs}/>
						<Route exact path="/freelancers" component={Freelancers}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/sign_up" component={SignUp}/>
					</div>

				</div>
			</HashRouter>
		);
	}
}

export default App;
