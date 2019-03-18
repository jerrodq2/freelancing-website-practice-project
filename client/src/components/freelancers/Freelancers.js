import React, { Component } from 'react';
import LoadingSpinner from 'components/UI/LoadingSpinner.js';


class Freelancers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			loading: true,
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
			loading: false,
		});
	};


	render() {
		return (
		  <div className="content">
				<h1>Freelancers below:</h1>

				<LoadingSpinner loading={this.state.loading}/>


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
