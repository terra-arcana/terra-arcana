import React from 'react';

/**
 * A CharacterProfile is the main view for displaying a character's details.
 * @class
 */
export default class CharacterProfile extends React.Component {

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
			character: undefined
		};
	}

	/**
	 * @override
	 * @param {Object} nextProps
	 */
	componentWillReceiveProps(nextProps) {
		// Reset state so spinner can be displayed
		this.setState({
			character: undefined
		});

		// Load new character data from API
		jQuery.get(WP_API_Settings.root + 'wp/v2/character?slug=' + nextProps.params.characterSlug, function(response) {
			this.setState({
				character: response[0]
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		// Show spinner by default
		var contents = (
			<div className="col-xs-12 text-center">
				<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
			</div>
		);

		if (this.state.character) {
			contents = (
				<h1 className="col-xs-12">Profil de {this.state.character.title.rendered}</h1>
			);
		}

		return (
			<div className="row">
				{contents}
			</div>
		);
	}
}

/**
 * @type {Object}
 */
CharacterProfile.propTypes = {
	params: React.PropTypes.object.isRequired
};
