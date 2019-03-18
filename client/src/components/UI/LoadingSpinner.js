import React, { Component } from 'react';
import { css } from '@emotion/core';
import { FadeLoader } from 'react-spinners';


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class LoadingSpinner extends Component{
	render() {
		return(
			<div>
				<FadeLoader
					css={override}
					sizeUnit={'px'}
					color={'#123abc'}
					loading={this.props.loading}
				/>
			</div>
		)
	}

};


export default LoadingSpinner;
