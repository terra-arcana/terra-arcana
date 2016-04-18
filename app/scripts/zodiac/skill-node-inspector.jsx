import React from 'react';
import Lodash from 'lodash';

require('../../styles/zodiac/skill-node-inspector.scss');

/**
 * A SkillNodeInspector shows details about a {@link SkillNode} or {@link UpgradeNode}.
 * It is meant for use in conjunction with a {@link SkillGraph} for zodiac viewing purposes.
 * @class
 */
export default class SkillNodeInspector extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			skill: {}
		};

		this.fetchSkillInfo = this.fetchSkillInfo.bind(this);
	}

	/**
	 * @override
	 */
	componentWillMount() {
		this.fetchSkillInfo(this.props.skill.id);
	}

	/**
	 * @override
	 */
	componentWillReceiveProps(nextProps) {
		// Empty state upon receiving new props to prevent desync
		this.setState({
			skill: {}
		});
		this.fetchSkillInfo(nextProps.skill.id);
	}

	/**
	 * @override
	 */
	componentWillUnmount() {
		this.fetchSkillRequest.abort();
	}

	/**
	 * Retrieve detailed skill info from the API and store it in component state
	 * @param {Number} skillID The ID of the skill to retrieve
	 * @private
	 */
	fetchSkillInfo(skillID) {
		/**
		 * REST request to the details about the active skill node
		 * @type {jqXHR}
		 * @private
		 */
		this.fetchSkillRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/skill/' + skillID, function(result) {
			var skillInfo = result;

			// Replace character class ID with full character class object
			this.fetchSkillRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/character-class/' + skillInfo.character_class, function(result) {
				skillInfo.character_class = result;

				this.setState({
					skill: skillInfo
				});
			}.bind(this));
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		if (!jQuery.isEmptyObject(this.state.skill)) {
			var skill = this.state.skill,
				perkButtons = (
					<div className="btn-group" role="group">
						<button type="button" className="btn btn-success btn-xs">
							<span className="glyphicon glyphicon-chevron-up"></span>&nbsp;
							1<span className="glyphicon glyphicon-fire"></span>
						</button>
						<button type="button" className="btn btn-danger btn-xs">
							<span className="glyphicon glyphicon-chevron-down"></span>
							&nbsp;
						</button>
					</div>
				);

			// Build skill info table
			var costRow = function(cost) {
					var costElements = [];

					if (cost.energy) {
						costElements.push(cost.energy + ' Énergie');
					}

					if (Lodash.isArray(cost.ingredients)) {
						for (var i = 0; i < cost.ingredients.length; i++) {
							if (cost.ingredients[i].amount) {
								costElements.push(cost.ingredients[i].amount + ' ' + cost.ingredients[i].ingredient.rendered);
							}
						}
					}

					return (costElements.length > 0) ? (
						<li className="list-group-item">
							<strong>Coût</strong>:&nbsp;
							{costElements.join(', ')}
							{(skill.perks[0].cost) ? perkButtons : null}
						</li>
					) : null;
				}(skill.cost[0]),

				castRow = (skill.cast.rendered) ? (
					<li className="list-group-item">
						<strong>Incantation</strong>:&nbsp;
						{skill.cast.rendered}&nbsp;
						{(skill.perks[0].cast) ? perkButtons : null}
					</li>
				) : null,

				durationRow = (skill.duration.rendered) ? (
					<li className="list-group-item">
						<strong>Durée</strong>:&nbsp;
						{skill.duration.rendered}&nbsp;
						{(skill.perks[0].duration) ? perkButtons : null}
					</li>
				) : null,

				usesRow = (skill.uses[0].amount) ? (
					<li className="list-group-item">
						<strong>Utilisations</strong>:&nbsp;
						{skill.uses[0].amount}/{skill.uses[0].type.rendered}&nbsp;
						{(skill.perks[0].uses) ? perkButtons : null}
					</li>
				) : null,

				rangeRow = (skill.range.rendered) ? (
					<li className="list-group-item">
						<strong>Portée</strong>:&nbsp;
						{skill.range.rendered}&nbsp;
						{(skill.perks[0].range) ? perkButtons : null}
					</li>
				) : null;

			return (
				<div className="col-sm-12 col-lg-4 skill-graph-editor-skill-node-inspector">
					{this.props.skill.upgrades.map(function(upgrade) {
						return (
							<div key={upgrade} className="panel panel-info upgrade-panel">
								<div className="panel-heading">
									<h3 className="panel-title" dangerouslySetInnerHTML={{__html: skill.upgrades[upgrade-1].title}}></h3>
								</div>
								<div className="panel-body" dangerouslySetInnerHTML={{__html: skill.upgrades[upgrade-1].effect}}></div>
							</div>
						);
					}.bind(this))}

					<div className="panel panel-default">
						<div className="panel-heading">
							<h2 className="panel-title"><span dangerouslySetInnerHTML={{__html: skill.title.rendered}}></span>&emsp;
								<small>
									<span dangerouslySetInnerHTML={{__html: skill.skill_type.rendered}}></span>&nbsp;|&nbsp;
									<span dangerouslySetInnerHTML={{__html: skill.character_class.title.rendered}}></span>
								</small>
							</h2>
						</div>
						<div
							className = "panel-body"
							dangerouslySetInnerHTML = {{__html: skill.effect}}>
						</div>
						<ul className="list-group">
							{costRow}
							{castRow}
							{usesRow}
							{durationRow}
							{rangeRow}
						</ul>
						<div className="panel-body">
							<em dangerouslySetInnerHTML={{__html: skill['flavor_text']}}></em>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="col-sm-12 col-lg-4 skill-graph-editor-skill-node-inspector">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h2 className="panel-title">Chargement...</h2>
						</div>
						<div className="panel-body">
							<p>Consultation des archives d'Asaké...</p>
						</div>
					</div>
				</div>
			);
		}
	}
}

/**
 * @type {Object}
 */
SkillNodeInspector.defaultProps = {
	skill: {
		id: '',
		upgrades: []
	}
};

/**
 * @type {Object}
 */
SkillNodeInspector.propTypes = {
	skill: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		upgrades: React.PropTypes.arrayOf(
			React.PropTypes.string
		).isRequired
	}),
	perks: React.PropTypes.shape({
		power: React.PropTypes.shape({
			current: React.PropTypes.number.isRequired,
			max: React.PropTypes.number.isRequired
		}),
		cast: React.PropTypes.shape({
			current: React.PropTypes.number.isRequired,
			max: React.PropTypes.number.isRequired
		}),
		duration: React.PropTypes.shape({
			current: React.PropTypes.number.isRequired,
			max: React.PropTypes.number.isRequired
		}),
		range: React.PropTypes.shape({
			current: React.PropTypes.number.isRequired,
			max: React.PropTypes.number.isRequired
		}),
		uses: React.PropTypes.shape({
			current: React.PropTypes.number.isRequired,
			max: React.PropTypes.number.isRequired
		})
	})
};
