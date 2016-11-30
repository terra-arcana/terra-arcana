import React from 'react';
import {Link} from 'react-router';
import Lodash from 'lodash';

import NavbarCharacterSwitcher from './navbar-character-switcher.jsx';

require('../../styles/navbar/navbar-user-panel.scss');

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

		this.getActiveCharacterData = this.getActiveCharacterData.bind(this);
		this.getInactiveCharactersData = this.getInactiveCharactersData.bind(this);
		this.onSwitchActiveCharacter = this.onSwitchActiveCharacter.bind(this);
		this.onActiveCharacterClick = this.onActiveCharacterClick.bind(this);
		this.onCharacterSwitcherToggleClick = this.onCharacterSwitcherToggleClick.bind(this);
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
					<li className="text-center">
						<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
					</li>
				</ul>
			),
			activeCharacterButton = (
				<li className="text-center">
					<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
				</li>
			),
			createCharacterButton = (
				<li>
					<Link
						to = '/personnage/creer/'
						className = "list-group-item list-group-item-success"
						>
						<span className="glyphicon glyphicon-plus pull-right"></span>
						Créer un personnage
					</Link>
				</li>
			),
			activeCharacterData = this.getActiveCharacterData();

		// There is an active character
		if (activeCharacterData) {
			activeCharacterButton = (
				<li>
					<Link
						className = "list-group-item ta-sidenav-active-character"
						to = {'/personnage/' + activeCharacterData.slug + '/'}
						onClick = {this.onActiveCharacterClick}
					>
						<h3 className="list-group-item-heading ta-sidenav-character-name">{activeCharacterData.title.rendered}</h3>
						<p className="list-group-item-text">Priorème {activeCharacterData.people.singular}</p>
					</Link>
				</li>
			);
		}

		// No active character
		else if (!this.state.loadingCharacters) {
			activeCharacterButton = (
				<li>
					<Link
						className = "list-group-item list-group-item-success"
						to = "/personnage/creer/"
					>
						<span className="glyphicon glyphicon-plus pull-right"></span>
						Créer un personnage
					</Link>
				</li>
			);
		}

		// Logged in
		if (this.props.currentUser) {
			contents = (
				<ul className="nav navbar-nav navbar-right ta-sidenav-user-panel">
					<li className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">{this.props.currentUser.name} <span className="caret"></span></a>
						<ul className="dropdown-menu list-group">
							{activeCharacterButton}
							<NavbarCharacterSwitcher
								characters = {this.getInactiveCharactersData()}
								onCharacterClick = {this.onSwitchActiveCharacter}
							/>
							{createCharacterButton}
						</ul>
					</li>
					<li><a href={WP_Theme_Settings.logoutURL}>Déconnexion</a></li>
				</ul>
			);
		}

		// Logged off
		else if (this.props.currentUser === null) {
			contents = (
				<ul className="nav navbar-nav navbar-right ta-sidenav-user-panel">
					<li><a href="/wp-login.php">Connexion</a></li>
					<li><a href="/wp-register.php">Inscription</a></li>
				</ul>
			);
		}

		return contents;
	}

	/**
	 * Get the data model for the current user's active character
	 * @return {Object|null} The character data model, or `null` if the character cannot be found
	 */
	getActiveCharacterData() {
		var character;

		if (this.props.currentUser) {
			for (var i = 0, len = this.state.userCharacters.length; i < len; i++) {
				character = this.state.userCharacters[i];
				if (character.id === this.props.currentUser['active_character']) {
					return character;
				}
			}
		}

		return null;
	}

	/**
	 * Get an array of all data models of the current user's inactive characters
	 * @return {Array} The character data models, as objects
	 */
	getInactiveCharactersData() {
		var inactiveCharacters = [],
			character;

		if (this.props.currentUser) {
			for (var i = 0, len = this.state.userCharacters.length; i < len; i++) {
				character = this.state.userCharacters[i];
				if (character.id !== this.props.currentUser['active_character']) {
					inactiveCharacters.push(character);
				}
			}
		}

		return inactiveCharacters;
	}

	/**
	 * Handle character switches
	 * @param {Number} id The new active character's ID
	 */
	onSwitchActiveCharacter(id) {
		if (this.props.onSwitchActiveCharacter) {
			this.props.onSwitchActiveCharacter(id);

			// Close the character switcher
			this.characterSwitcherToggle.click();
		}
	}

	/**
	 * Handle clicks on active character link
	 */
	onActiveCharacterClick() {
		if (jQuery(this.characterSwitcherToggle).hasClass('collapsed')) {
			this.characterSwitcherToggle.click();
		}
	}

	/**
	 * Handle clicks on menu toggle button
	 * @param {MouseSyntheticEvent} event The click event
	 */
	onCharacterSwitcherToggleClick(event) {
		jQuery(this.characterSwitcherToggle).toggleClass('collapsed');
		event.stopPropagation();
		event.preventDefault();
	}
}

/**
 * @type {Object}
 */
NavbarUserPanel.propTypes = {
	currentUser: React.PropTypes.object,

	onSwitchActiveCharacter: React.PropTypes.func
};
