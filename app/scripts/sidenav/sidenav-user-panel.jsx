import React from 'react';

require('../../styles/sidenav/sidenav-user-panel.scss');

export default class SidenavUserPanel extends React.Component {

	/**
	 * @override
	 * @return {jsx} Component template
	 */
	render() {
		var contents = <noscript/>;

		// Logged in
		if (this.props.currentUser) {
			contents = (
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
		}

		// Logged off
		else if (this.props.currentUser === null) {
			contents = (
				<div className="panel panel-default navbar-fixed-bottom">

					<ul className="list-group">
						<li className="list-group-item"><a href="/wp-login.php">Connexion</a></li>
						<li className="list-group-item list-group-item-success"><a href="/wp-register.php">Inscription</a></li>
					</ul>
				</div>
			);
		}

		return (
			<div className="ta-sidenav-user-panel">
				{contents}
			</div>
		);
	}
}

SidenavUserPanel.propTypes = {
	currentUser: React.PropTypes.object
};
