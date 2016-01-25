import React from 'react';

import Greeting from './greeting.jsx';

/**
 * Index page component
 * @class
 */
export default class Index extends React.Component {
	
	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div>
				<Greeting name="World" />
			</div>
		);
	}
}
