import React from 'react';
import {Link} from 'react-router';

require('../styles/sidenav.scss');

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
		var userPanel = <noscript />;

		if (this.props.currentUser) {
			userPanel = (
				<div className="panel panel-default navbar-fixed-bottom">
					<div className="panel-heading">
						<h2 className="panel-title"><a href="#">{this.props.currentUser.name}</a> <small>incarne</small></h2>
					</div>
					<div className="list-group">
						<a className="list-group-item" href="#">
							<h3 className="list-group-item-heading">Boba Fett</h3>
							<p className="list-group-item-text">Gars badass galicien</p>
						</a>
						<a className="list-group-item" href={WP_Theme_Settings.logoutURL}>Déconnexion</a>
					</div>
				</div>
			);
		} else if (this.props.currentUser === null) {
			userPanel = (
				<div className="panel panel-default navbar-fixed-bottom">

					<ul className="list-group">
						<li className="list-group-item"><a href="/wp-login.php">Connexion</a></li>
						<li className="list-group-item list-group-item-success"><a href="/wp-register.php">Inscription</a></li>
					</ul>
				</div>
			);
		}

		return (
			<nav className="ta-sidenav">
				<div className="container-fluid">
					<Link to="/" className="ta-sidenav-logo">
						<img src={WP_Theme_Settings.imageRoot + 'terra-logo-blanc.png'} />
					</Link>

					<ul className="nav nav-pills nav-stacked">
						<li><Link to="/codex">Codex Arcanum</Link></li>
						<li><Link to="/zodiaque">Zodiaque</Link></li>
					</ul>

					<div className="ta-sidenav-user-panel">
						{userPanel}
					</div>
				</div>
			</nav>
		);
	}
}

/**
 * @type {Object}
 */
Sidenav.propTypes = {
	currentUser: React.PropTypes.object
};
