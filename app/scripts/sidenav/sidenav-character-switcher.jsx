import React from 'react';

export default class SidenavCharacterSwitcher extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return(
			<div id="ta-sidenav-character-switcher" className="ta-sidenav-character-switcher collapse">
				{this.props.characters.map(function(character) {
					return (
						<button key={character.id} type="button" className="list-group-item list-group-item-info" href="#">
							<h4 className="list-group-item-heading">{character.title.rendered}</h4>
							<p className="list-group-item-text">Gars badass galicien</p>
						</button>
					);
				}.bind(this))}
			</div>
		);
	}
}

/**
 * @type {Object}
 */
SidenavCharacterSwitcher.defaultProps = {
	characters: [
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
	]
};

/**
 * @type {Object}
 */
SidenavCharacterSwitcher.propTypes = {
	characters: React.PropTypes.arrayOf(
		React.PropTypes.object
	)
};
