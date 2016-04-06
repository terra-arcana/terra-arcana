import React from 'react';

import Greeting from './greeting.jsx';

/**
 * An IndexPage is the main view for displaying the homepage.
 * @class
 */
export default class IndexPage extends React.Component {

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
