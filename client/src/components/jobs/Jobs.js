import React, { Component } from 'react';


class Jobs extends Component {
	constructor(props) {
		super(props);

		// remember, the below componentDidMount is asynchronous, it triggers after the page loads. So make sure to declare state.data here, otherwise it will error out in the render below, since it tries to use .map() on an array that doesn't exist. This way, didMount, doesn't try to create state.data, only updates it
		this.state = {
			data: [],
		}
	}


	async componentDidMount() {
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
		  <div className="content">
				<h1>Jobs below:</h1>
				{ this.state.data.map((index) => {
					return (
						<div key={ index.id }>
							<h4>{index.title}</h4>
							<p>Description: {index.description}</p>
							<p><i>Experience Level Requested:</i> {index.experience_level_requested}</p>
							<hr/>
						</div>
					);
				})}
			</div>
		) // end of return
	}
};


export default Jobs;
