import React from 'react';

/**
 * A CharacterProfilePage is the main view for displaying a character's details.
 * @class
 */
export default class CharacterProfilePage extends React.Component {

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

		this.fetchCharacterData = this.fetchCharacterData.bind(this);
	}

	componentDidMount() {
		this.fetchCharacterData(this.props.params.characterSlug);
	}

	/**
	 * @override
	 * @param {Object} nextProps
	 */
	componentWillReceiveProps(nextProps) {
		// Only update character if something changed
		if (nextProps.params.characterSlug !== this.props.params.characterSlug) {
			this.setState({
				character: undefined
			});

			this.fetchCharacterData(nextProps.params.characterSlug);
		}
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

	fetchCharacterData(slug) {
		jQuery.get(WP_API_Settings.root + 'wp/v2/character?slug=' + slug, function(response) {
			this.setState({
				character: response[0]
			});
		}.bind(this));
	}
}

/**
 * @type {Object}
 */
CharacterProfilePage.propTypes = {
	params: React.PropTypes.shape({
		characterSlug: React.PropTypes.string.isRequired
	}).isRequired
};
