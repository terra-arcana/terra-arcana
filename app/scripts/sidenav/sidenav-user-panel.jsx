import React from 'react';
import {Link} from 'react-router';

import SidenavCharacterSwitcher from './sidenav-character-switcher.jsx';

require('../../styles/sidenav/sidenav-user-panel.scss');

/**
 * A SidenavUserPanel displays the currently logged in user in a {@link Sidenav},
 * along with any useful information and links related to the currently logged in user.
 * If logged out, the panel will display links to the login and register pages.
 * @class
 */
export default class SidenavUserPanel extends React.Component {

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
				<div className="panel panel-default navbar-fixed-bottom">
					<ul className="list-group">
						<li className="list-group-item text-center">
							<span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />
						</li>
					</ul>
				</div>
			),
			activeCharacterButton = (
				<li className="list-group-item text-center">
					<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
				</li>
			),
			incarnatesLabel = <noscript />,
			activeCharacterData = this.getActiveCharacterData();

		// There is an active character
		if (activeCharacterData) {
			incarnatesLabel = <small>incarne</small>;

			activeCharacterButton = (
				<Link
					to = {'/personnage/' + activeCharacterData.slug + '/'}
					className = "list-group-item ta-sidenav-active-character"
				>
					<button
						ref = {(ref) => this.characterSwitcherToggle = ref}
						type="button"
						className="ta-sidenav-character-switcher-toggle btn btn-link pull-right collapsed"
						data-toggle="collapse"
						data-target="#ta-sidenav-character-switcher"
					>
						<span className="glyphicon"></span>
					</button>
					<h3 className="list-group-item-heading ta-sidenav-character-name">{activeCharacterData.title.rendered}</h3>
					<p className="list-group-item-text">Priorème {activeCharacterData.people.singular}</p>
				</Link>
			);
		}

		// No active character
		else if (!this.state.loadingCharacters) {
			activeCharacterButton = (
				<a className="list-group-item list-group-item-success" href="#">
					<span className="glyphicon glyphicon-plus pull-right"></span>
					Créer un personnage
				</a>
			);
		}

		// Logged in
		if (this.props.currentUser) {
			contents = (
				<div className="panel panel-default navbar-fixed-bottom">
					<div className="panel-heading">
						<h2 className="panel-title">
							<a href="#">{this.props.currentUser.name}</a> {incarnatesLabel}
						</h2>
					</div>
					<div className="list-group">
						{activeCharacterButton}
						<SidenavCharacterSwitcher
							characters = {this.getInactiveCharactersData()}
							onCharacterClick = {this.onSwitchActiveCharacter}
						/>

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
}

/**
 * @type {Object}
 */
SidenavUserPanel.propTypes = {
	currentUser: React.PropTypes.object,

	onSwitchActiveCharacter: React.PropTypes.func
};
