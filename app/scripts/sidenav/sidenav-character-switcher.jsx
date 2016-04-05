import React from 'react';
import {Link} from 'react-router';

/**
 * A SidenavCharacterSwitcher lists all characters belonging to a user, except
 * the currently active one. It allows users to switch their active character to
 * another one. This is meant to be used within a {@link SidenavUserPanel}.
 * @class
 */
export default class SidenavCharacterSwitcher extends React.Component {

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
			<div id="ta-sidenav-character-switcher" className="ta-sidenav-character-switcher collapse">
				{this.props.characters.map(function(character) {
					return (
						<Link
							to={'/personnage/' + character.slug + '/'}
							key={character.id}
							className="list-group-item list-group-item-info"
							onClick={this.onCharacterClick}
							data-character-id={character.id}
						>
							<h4 className="list-group-item-heading no-events">{character.title.rendered}</h4>
							<p className="list-group-item-text no-events">Gars badass galicien</p>
						</Link>
					);
				}.bind(this))}
				<a href="#" className="list-group-item list-group-item-success">
					<span className="glyphicon glyphicon-plus pull-right"></span>
					Créer un personnage
				</a>
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
SidenavCharacterSwitcher.propTypes = {
	characters: React.PropTypes.arrayOf(
		React.PropTypes.object
	).isRequired,

	onCharacterClick: React.PropTypes.func
};
