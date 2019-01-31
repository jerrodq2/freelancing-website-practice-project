import React, { Component } from 'react';


class TestClient extends Component {
	constructor(props) {
		super(props);

		// remember, the below componentDidMount is asynchronous, it triggers after the page loads. So make sure to declare state.client here, otherwise it will error out in the render below, since it asks for keys of an object that doesn't exist. This way, didMount, doesn't try to create state.client, only updates it
		this.state = {
			client: {},
		}
	}


	async componentDidMount() {
		// The Below code is an example of a GET route that requires an id in the url (url parameters)
		const encodedValue = encodeURIComponent('149b4f3b-768e-4372-ab37-121e7c551364');
		// /user_client/:id
		const response = await fetch(`http://localhost:7000/user_client/${encodedValue}`, {
			method: "GET",
			// headers: headers,
		})

		const data = await response.json();

		this.setState({
			client: data,
		})
		console.log(this.state);
	}



	render() {
		return (
		  <div>
				<h1>Client: {this.state.client.first_name} {this.state.client.last_name}</h1>
				<h5>Summary</h5>
				<p>{this.state.client.summary}</p>

			</div>
		) // end of return
	}
};


export default TestClient;
