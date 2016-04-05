import React from 'react';

export default class CharacterProfile extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<h1>Profil de {this.props.params.characterSlug}</h1>
		);
	}
}
