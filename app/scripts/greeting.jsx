import React from 'react';

/**
 * Greeting component. Used for testing purposes.
 *
 * @class
 */
export default class Greeting extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="greeting">
				Hello, {this.props.name}!
			</div>
		);
	}
}
