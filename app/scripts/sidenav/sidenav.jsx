import React from 'react';
import {Link} from 'react-router';

import SidenavUserPanel from './sidenav-user-panel.jsx';
import packageInfo from '../../../package.json';

require('../../styles/sidenav/sidenav.scss');
require('../../images/terra-logo-blanc.png');

/**
 * Sidenav component
 * @class
 */
export default class Sidenav extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<nav className="ta-sidenav">
				<div className="container-fluid">
					<div className="ta-version-notice">
						v{packageInfo.version}
					</div>

					<Link to="/" className="ta-sidenav-logo">
						<img src={WP_Theme_Settings.imageRoot + 'terra-logo-blanc.png'} />
					</Link>

					<ul className="nav nav-pills nav-stacked">
						<li><Link to="/codex/">Codex Arcanum</Link></li>
						<li><Link to="/zodiaque/">Zodiaque</Link></li>
					</ul>

					<SidenavUserPanel
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
Sidenav.propTypes = {
	currentUser: React.PropTypes.object,

	onSwitchActiveCharacter: React.PropTypes.func
};
