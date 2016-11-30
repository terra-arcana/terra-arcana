import React from 'react';
import {Link, IndexLink} from 'react-router';

import NavbarUserPanel from './navbar-user-panel.jsx';

require('../../styles/navbar/navbar.scss');
require('../../images/terra-logo-blanc.png');

/**
 * Top navigation bar component
 * @class
 */
export default class Navbar extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<nav className="ta-navbar navbar navbar-inverse">
				<div className="container">
					<div className="navbar-header">
						<IndexLink to="/" className="ta-navbar-logo">
							<img src={WP_Theme_Settings.imageRoot + 'terra-logo-blanc.png'} />
						</IndexLink>
					</div>

					<ul className="nav navbar-nav">
						<li><Link to="/codex/">Codex Arcanum</Link></li>
						<li><Link to="/zodiaque/">Zodiaque</Link></li>
					</ul>

					<NavbarUserPanel
						currentUser = {this.props.currentUser}
						onSwitchActiveCharacter = {this.props.onSwitchActiveCharacter}
					/>
				</div>
			</nav>
		);
	}
}

/**
 * @type {Object}
 */
Navbar.propTypes = {
	currentUser: React.PropTypes.object,

	onSwitchActiveCharacter: React.PropTypes.func
};
