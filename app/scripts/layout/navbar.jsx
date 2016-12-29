import React from 'react';
import {Link, IndexLink} from 'react-router';

import NavbarUserPanel from './navbar-user-panel.jsx';

require('../../styles/layout/navbar.scss');
require('../../images/terra-logo-blanc.png');

/**
 * Top navigation bar component
 * @class
 */
export default class Navbar extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Default props
	 */
	constructor(props) {
		super(props);

		this.onNavLinkClick = this.onNavLinkClick.bind(this);
		this.onSectionsToggleClick = this.onSectionsToggleClick.bind(this);
		this.onUserPanelToggleClick = this.onUserPanelToggleClick.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var linkData = [
			{
				link: '/codex/',
				caption: 'Codex Arcanum'
			},
			{
				link: '/systeme/',
				caption: 'Système de jeu'
			},
			{
				link: '/zodiaque/',
				caption: 'Zodiaque'
			}
		];

		return (
			<nav className="ta-navbar navbar navbar-inverse">
				<div className="container">
					<div className="navbar-header">
						<IndexLink to="/" className="ta-navbar-logo">
							<img src={WP_Theme_Settings.imageRoot + 'terra-logo-blanc.png'} />
						</IndexLink>
					</div>

					<button
						id = "ta-navbar-sections-toggle"
						className = "ta-navbar-toggle btn btn-lg btn-link glyphicon glyphicon-menu-hamburger"
						onClick = {this.onSectionsToggleClick}
					/>
					<ul
						id = "ta-navbar-sections"
						className = "ta-navbar-sidebar nav navbar-nav"
					>
						{linkData.map(function(link) {
							return (
								<li key={link.link}>
									<Link
										to = {link.link}
										onClick = {this.onNavLinkClick}
									>
										{link.caption}
									</Link>
								</li>
							);
						}.bind(this))}
					</ul>

					<button
						id = "ta-navbar-user-panel-toggle"
						className = "ta-navbar-toggle btn btn-lg btn-link glyphicon glyphicon-user"
						onClick = {this.onUserPanelToggleClick}
					/>
					<NavbarUserPanel
						currentUser = {this.props.currentUser}
						onNavLinkClick = {this.onNavLinkClick}
					/>
				</div>
			</nav>
		);
	}

	/**
	 * @private
	 */
	onSectionsToggleClick() {
		jQuery('#main')
			.toggleClass('sections-menu-open')
			.removeClass('user-panel-open');
	}

	/**
	 * @private
	 */
	onUserPanelToggleClick() {
		jQuery('#main')
			.removeClass('sections-menu-open')
			.toggleClass('user-panel-open');
	}

	/**
	 * @private
	 */
	onNavLinkClick() {
		jQuery('#main')
			.removeClass('sections-menu-open')
			.removeClass('user-panel-open');
	}
}

/**
 * @type {Object}
 */
Navbar.propTypes = {
	currentUser: React.PropTypes.object,

	onSwitchActiveCharacter: React.PropTypes.func
};
