import React from 'react';

/**
 * A CharacterProfile is a view detailing the public profile of a given character.
 * It exposes additional controls to the character's owner or a site admin.
 * @class
 */
export default class CharacterProfile extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return <h2 className="col-xs-12">Profil</h2>;
	}
}
