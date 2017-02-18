import React from 'react';

require('../../styles/layout/spinner.scss');

/**
 * A Spinner renders a simple spinner graphic on the screen for loading purposes.
 * @class
 */
export default class Spinner extends React.Component {

	/**
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="text-center">
				<InlineSpinner />
			</div>
		);
	}
}

/**
 * A CenteredSpinner renders a simple spinner graphic at the center of the screen.
 * @class
 */
export class CenteredSpinner extends React.Component {

	/**
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="ta-centered-spinner">
				<Spinner />
			</div>
		);
	}
}

/**
 * An InlineSpinner renders a simple inline spinner graphic on the screen
 * for loading purposes.
 * @class
 */
export class InlineSpinner extends React.Component {

	/**
	 * @return {jsx} The component template
	 */
	render() {
		return <span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />;
	}
}
