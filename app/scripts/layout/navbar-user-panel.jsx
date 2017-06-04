import PropTypes from 'prop-types';
import Lodash from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

import Spinner from './spinner.jsx';

require('../../styles/layout/navbar-user-panel.scss');

/**
 * A NavbarUserPanel displays the currently logged in user in a {@link Sidenav},
 * along with any useful information and links related to the currently logged in user.
 * If logged out, the panel will display links to the login and register pages.
 * @class
 */
export default class NavbarUserPanel extends React.Component {

	/**
	 * @constructor
	 * @param {Object} Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			loadingCharacters: true,
			userCharacters: []
		};
	}

	/**
	 * @override
	 * @param {Object} nextProps The next props
	 */
	componentWillReceiveProps(nextProps) {
		if (nextProps.currentUser) {
			jQuery.get(WP_API_Settings.root + 'wp/v2/character?author=' + nextProps.currentUser.id, function(charactersResult) {
				var peopleRequests = [];

				/**
				 * Update the `people` field on a character entry returned from the character request.
				 * @param {number} i The index of the character in `charactersResult` we just fetched the people from
				 * @param {Function} A callback for the people request
				 */
				function onPeopleRequestDone(i) {
					return function(peopleResult) {
						charactersResult[i].people = {
							id: charactersResult[i].people,
							name: peopleResult.title.rendered,
							singular: peopleResult.singular
						};
					};
				}

				// Fetch people's singular for each character
				for (var i = 0, len = charactersResult.length; i < len; i++) {
					peopleRequests.push(jQuery.get(WP_API_Settings.root + 'wp/v2/people/' + charactersResult[i].people, onPeopleRequestDone(i)));
				}

				// Wait for all people requests to finish before updating state
				jQuery.when.apply(jQuery, peopleRequests).done(function() {
					// Close character switcher when user characters have changed
					if (!Lodash.isEqual(this.state.userCharacters, charactersResult)) {
						jQuery('#ta-sidenav-character-switcher').collapse('hide');
					}

					this.setState({
						loadingCharacters: false,
						userCharacters: charactersResult
					});
				}.bind(this));
			}.bind(this));
		}
	}

	/**
	 * @override
	 * @return {jsx} Component template
	 */
	render() {
		var contents = (
				<ul className="nav navbar-nav navbar-right ta-sidenav-user-panel">
					<Spinner />
				</ul>
			);

		// Logged in
		if (this.props.currentUser) {
			contents = (
				<ul
					id = "ta-navbar-user-panel"
					className = "ta-navbar-sidebar nav navbar-nav navbar-right"
				>
					<li className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{this.props.currentUser.name} <span className="caret"></span></a>
						<ul className="dropdown-menu ta-character-picker">
							<li className="dropdown-header">Mes personnages</li>
							{this.state.userCharacters.map(function(character) {
								return (
									<li key={character.id}>
										<Link
											to = {'/personnage/' + character.slug}
											className = "ta-user-panel-character"
											onClick = {this.props.onNavLinkClick}
										>
											<span className="ta-user-panel-character-name">{character.title.rendered}</span><br />
											Priorème {character.people.singular}
										</Link>
									</li>
								);
							}.bind(this))}

							<li className="divider"></li>
							<li>
								<Link
									to = '/personnage/creer'
									className = "text-success"
									onClick = {this.props.onNavLinkClick}
								>
									<span className="glyphicon glyphicon-plus pull-right"></span>
									Créer un personnage
								</Link>
							</li>
						</ul>
					</li>

					<li><a href={WP_Theme_Settings.logoutURL}>Déconnexion</a></li>
				</ul>
			);
		}

		// Logged off
		else if (this.props.currentUser === null) {
			contents = (
				<ul
					id = "ta-navbar-user-panel"
					className = "ta-navbar-sidebar nav navbar-nav navbar-right"
				>
					<li><a href="/wp-login.php">Connexion</a></li>
					<li><a href="/wp-register.php">Inscription</a></li>
				</ul>
			);
		}

		return contents;
	}
}

/**
 * @type {Object}
 */
NavbarUserPanel.propTypes = {
	currentUser: PropTypes.object,

	onNavLinkClick: PropTypes.func
};
