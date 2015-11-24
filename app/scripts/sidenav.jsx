import React from 'react';
import Router from 'react-router';
import {Link} from 'react-router';

require('../styles/sidenav.scss');

/**
 * Sidenav component
 *
 * @class
 */
export default class Sidenav extends React.Component {
	
	/**
	 * @constructor
	 * @param {object} props Default props
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<nav className="sidenav">
				<div className="container-fluid">
					<ul className="nav nav-pills nav-stacked">
						<li><Link to="/">Index</Link></li>
						<li><Link to="/competences">Compétences</Link></li>
						<li><Link to="/codex">Codex</Link></li>
					</ul>
				</div>
			</nav>
		);
	}
}
