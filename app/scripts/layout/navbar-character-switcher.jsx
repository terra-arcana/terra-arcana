import React from 'react';
import {Link} from 'react-router';

/**
 * A NavbarCharacterSwitcher lists all characters belonging to a user, except
 * the currently active one. It allows users to switch their active character to
 * another one. This is meant to be used within a {@link SidenavUserPanel}.
 * @class
 */
export default class NavbarCharacterSwitcher extends React.Component {

	/**
	 * @constructor
	 * @param {Object} Default props
	 */
	constructor(props) {
		super(props);

		this.onCharacterClick = this.onCharacterClick.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return(
			<div className="ta-sidenav-character-switcher">
				{this.props.characters.map(function(character) {
					return (
						<li key = {character.id}>
							<Link
								to = {'/personnage/' + character.slug + '/'}
								className = "list-group-item list-group-item-info"
								onClick = {this.onCharacterClick}
								data-character-id = {character.id}
							>
								<h4 className="list-group-item-heading no-events ta-sidenav-character-name">{character.title.rendered}</h4>
								<p className="list-group-item-text no-events">Priorème {character.people.singular}</p>
							</Link>
						</li>
					);
				}.bind(this))}
			</div>
		);
	}

	/**
	 * Handle character button clicks
	 * @param {SyntheticMouseEvent} event Click event
	 */
	onCharacterClick(event) {
		if (this.props.onCharacterClick) {
			this.props.onCharacterClick(parseInt(event.target.dataset.characterId));
		}
	}
}

/**
 * @type {Object}
 */
NavbarCharacterSwitcher.propTypes = {
	characters: React.PropTypes.arrayOf(
		React.PropTypes.object
	).isRequired,

	onCharacterClick: React.PropTypes.func
};
