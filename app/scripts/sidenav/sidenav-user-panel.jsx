import React from 'react';

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

		this.state = {
			userCharacters: [
				{
					id: 1,
					title: {
						rendered: 'Zilane Astaldo'
					}
				},
				{
					id: 2,
					title: {
						rendered: 'Boba Fett'
					}
				},
				{
					id: 3,
					title: {
						rendered: 'Noko Chasca'
					}
				}
			],
			activeCharacter: 1
		};

		this.getActiveCharacterData = this.getActiveCharacterData.bind(this);
		this.getInactiveCharactersData = this.getInactiveCharactersData.bind(this);
		this.switchActiveCharacter = this.switchActiveCharacter.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} Component template
	 */
	render() {
		var contents = <noscript/>,
			activeCharacterData = this.getActiveCharacterData();

		// Logged in
		if (this.props.currentUser) {
			contents = (
				<div className="panel panel-default navbar-fixed-bottom">
					<div className="panel-heading">
						<h2 className="panel-title"><a href="#">{this.props.currentUser.name}</a> <small>incarne</small></h2>
					</div>
					<div className="list-group">
						<a className="list-group-item" href="#">
							<button
								ref = {(ref) => this.characterSwitcherToggle = ref}
								type="button"
								className="ta-sidenav-character-switcher-toggle btn btn-link pull-right collapsed"
								data-toggle="collapse"
								data-target="#ta-sidenav-character-switcher"
							>
								<span className="glyphicon"></span>
							</button>
							<h3 className="list-group-item-heading">{activeCharacterData.title.rendered}</h3>
							<p className="list-group-item-text">Gars badass galicien</p>
						</a>
						<SidenavCharacterSwitcher
							characters = {this.getInactiveCharactersData()}
							onCharacterClick = {this.switchActiveCharacter}
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

		for (var i = 0, len = this.state.userCharacters.length; i < len; i++) {
			character = this.state.userCharacters[i];
			if (character.id === this.state.activeCharacter) {
				return character;
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

		for (var i = 0, len = this.state.userCharacters.length; i < len; i++) {
			character = this.state.userCharacters[i];
			if (character.id !== this.state.activeCharacter) {
				inactiveCharacters.push(character);
			}
		}

		return inactiveCharacters;
	}

	/**
	 * Changes the current user's active character to a new one.
	 * @param {number} id The new active character's ID
	 */
	switchActiveCharacter(id) {
		this.setState({
			activeCharacter: id
		});

		// Close the character switcher
		this.characterSwitcherToggle.click();

		// TODO: Store this new value in the user model on WordPress
	}
}

/**
 * @type {Object}
 */
SidenavUserPanel.propTypes = {
	currentUser: React.PropTypes.object
};
