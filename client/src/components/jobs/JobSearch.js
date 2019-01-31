import React, { Component } from 'react';


class JobSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
		}
	}


	async componentDidMount() {

		// The Below code is an example of a GET route that requires an id in the url (url parameters)
		// const encodedValue = encodeURIComponent('149b4f3b-768e-4372-ab37-121e7c551364');
		// // /user_client/:id
		// fetch(`http://localhost:7000/user_client/${encodedValue}`, {
		//   method: "GET",
		//   // headers: headers,
		// })
		//   .then(response => {
		// 		console.log(response.status);
		// 		console.log(response);
		// 	})


			const response = await fetch(`http://localhost:7000/jobs/`, {
				method: "GET",
				// headers: headers,
			})
			const data = await response.json();

			this.setState({
				data: data,
			});
	}


	render() {
		return (
		  <div>
				<h1>Jobs below:</h1>
				{ this.state.data.map((index) => {
					return (
						<div key={ index.id }>
							<h4>{index.title}</h4>
							<p>{index.description}</p>
							<p><i>Experience Level Requested:</i> {index.experience_level_requested}</p>
						</div>
					);
				})}
			</div>
		) // end of return
	}
};


export default JobSearch;
