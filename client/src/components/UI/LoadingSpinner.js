import React, { Component } from 'react';
import { FadeLoader } from 'react-spinners';
import './loadingspinner.css';


class LoadingSpinner extends Component{
	render() {
		return(
			<div>
				<FadeLoader
					css='test'
					sizeUnit={'px'}
					size={150}
					color={'#123abc'}
					loading={this.props.loading}
				/>
			</div>
		)
	}

};


export default LoadingSpinner;
