import React from 'react';

require('../../styles/character/character-sheet.page.scss');

/**
 * A CharacterSheet is a view detailing all of the character's useful information
 * in a print-friendly format.
 * @class
 */
export default class CharacterSheet extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			skillInfo: []
		};
	}

	/**
	 * @override
	 */
	componentWillMount() {
		var i, len,
			skillIDs = [],
			currentBuild = this.props.character['current_build'];

		for (i = 0, len = currentBuild.length; i < len; i++) {
			if (currentBuild[i].type === 'skill') {
				skillIDs.push(currentBuild[i].id);
			}
		}

		jQuery.get(WP_API_Settings.root + 'wp/v2/skill?include=' + skillIDs.join(','), function(result) {
			this.setState({
				skillInfo: result
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {html} The component template
	 */
	render() {
		var skills = <span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />;

		if (this.state.skillInfo) {
			skills = (
				<ul className="col-xs-12">
					{this.state.skillInfo.map(function(skill) {
						return (
							<li>
								<h4>{skill.title.rendered}</h4>
							</li>
						);
					}.bind(this))}
				</ul>
			);
		}

		return (
			<div className="ta-character-sheet">
				<h2 className="col-xs-12">
					{this.props.character.title.rendered}&nbsp;
					<a href="#" className="btn btn-primary btn-sm no-print" onClick={() => window.print()}>
						<span className="glyphicon glyphicon-print no-events" />
						<span className="no-events">&nbsp;Imprimer</span>
					</a>
				</h2>

				<h3 className="col-xs-12">Compétences</h3>
				{skills}
			</div>
		);
	}
}

CharacterSheet.propTypes = {
	character: React.PropTypes.object.isRequired
};
