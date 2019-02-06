import React, { Component } from 'react';


class Freelancers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
		}
	}


	async componentDidMount() {
		const response = await fetch(`http://localhost:7000/freelancers/`, {
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
				<h1>Freelancers below:</h1>
				{ this.state.data.map((index) => {
					return (
						<div key={ index.id }>
							<h4>{index.first_name} {index.last_name}</h4>
							<p>Summary: {index.summary ? index.summary : 'N/A'}</p>
							<p><i>Experience Level:</i> {index.experience_level}</p>
							<hr/>
						</div>
					);
				})}
			</div>
		) // end of return
	}
};


export default Freelancers;
