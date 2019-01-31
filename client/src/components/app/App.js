import React, { Component } from 'react';
import Header from '../UI/Navbar';
import JobSearch from '../jobs/JobSearch'
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
			<div className="App">
				<Header />

				<div className="container">
					<JobSearch />
				</div>

			</div>
		);
	}
}

export default App;
