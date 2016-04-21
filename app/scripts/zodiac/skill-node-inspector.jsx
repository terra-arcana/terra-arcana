import React from 'react';
import Lodash from 'lodash';

import PerkButtonGroup from './perk-button-group.jsx';

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

		/**
		 * The string to search for in effect when parsing power levels
		 * @static
		 * @const
		 * @type {string}
		 */
		this.PL_STRING = 'NP';

		/**
		 * The current total of perks bought by the character on this skillLevel
		 * @type {Object}
		 */
		this.skillLevel = 0;

		this.fetchSkillInfo = this.fetchSkillInfo.bind(this);
		this.updateSkillLevel = this.updateSkillLevel.bind(this);
		this.parseSkillEffect = this.parseSkillEffect.bind(this);
		this.onPerkButtonClick = this.onPerkButtonClick.bind(this);

		this.updateSkillLevel(props);
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
		// Only refresh skill info if we changed skills
		if (this.props.skill.id !== nextProps.skill.id) {
			this.setState({
				skill: {}
			});
			this.fetchSkillInfo(nextProps.skill.id);
		}

		this.updateSkillLevel(nextProps);
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
			var skill = this.state.skill;

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
						</li>
					) : null;
				}(skill.cost[0]),

				castRow = (skill.cast.rendered) ? (
					<li className="list-group-item">
						<strong>Incantation</strong>:&nbsp;

						{function() {
							// Display boosted value if perks were bought
							if (this.props.perks && this.props.perks.cast.current) {
								var keys = Object.keys(this.props.metadata.cast),
									index = keys.indexOf(skill.cast.value),
									newIndex = Math.max(index - this.props.perks.cast.current, 0);

								return (
									<span className="text-success">
										<strong>
											{this.props.metadata.cast[keys[newIndex]]}
										</strong>
									</span>
								);
							} else {
								return skill.cast.rendered;
							}
						}.bind(this)()}

						{(skill.perks[0].cast && this.props.perks) ? (
							<PerkButtonGroup
								currentLevel = {this.props.perks.cast.current}
								maxLevel = {this.props.perks.cast.max}
								cost = {this.skillLevel+1}
								onPerkUpClick = {this.onPerkButtonClick.bind(this, 'cast', 'up')}
								onPerkDownClick = {this.onPerkButtonClick.bind(this, 'cast', 'down')}
							/>
						) : null}
					</li>
				) : null,

				durationRow = (skill.duration.rendered) ? (
					<li className="list-group-item">
						<strong>Durée</strong>:&nbsp;

						{function() {
							// Display boosted value if perks were bought
							if (this.props.perks && this.props.perks.duration.current) {
								var keys = Object.keys(this.props.metadata.duration),
									index = keys.indexOf(skill.duration.value),
									newIndex = Math.min(index + this.props.perks.duration.current, keys.length - 1);

								return (
									<span className="text-success">
										<strong>
											{this.props.metadata.duration[keys[newIndex]]}
										</strong>
									</span>
								);
							} else {
								return skill.duration.rendered;
							}
						}.bind(this)()}

						{(skill.perks[0].duration && this.props.perks) ? (
							<PerkButtonGroup
								currentLevel = {this.props.perks.duration.current}
								maxLevel = {this.props.perks.duration.max}
								cost = {this.skillLevel+1}
								onPerkUpClick = {this.onPerkButtonClick.bind(this, 'duration', 'up')}
								onPerkDownClick = {this.onPerkButtonClick.bind(this, 'duration', 'down')}
							/>
						) : null}
					</li>
				) : null,

				usesRow = (skill.uses[0].amount) ? (
					<li className="list-group-item">
						<strong>Utilisations</strong>:&nbsp;
						{
							// Display boosted value if perks were bought
							(this.props.perks && this.props.perks.uses.current) ? (
							<span className="text-success">
								<strong>
									{parseInt(skill.uses[0].amount) + parseInt(this.props.perks.uses.current)}
								</strong>
							</span>
						) : skill.uses[0].amount}

						/{skill.uses[0].type.rendered}

						{(skill.perks[0].uses && this.props.perks) ? (
							<PerkButtonGroup
								currentLevel = {this.props.perks.uses.current}
								maxLevel = {this.props.perks.uses.max}
								cost = {this.skillLevel+1}
								onPerkUpClick = {this.onPerkButtonClick.bind(this, 'uses', 'up')}
								onPerkDownClick = {this.onPerkButtonClick.bind(this, 'uses', 'down')}
							/>
						) : null}
					</li>
				) : null,

				rangeRow = (skill.range.rendered) ? (
					<li className="list-group-item">
						<strong>Portée</strong>:&nbsp;

						{function() {
							// Display boosted value if perks were bought
							if (this.props.perks && this.props.perks.range.current) {
								var keys = Object.keys(this.props.metadata.range),
									index = keys.indexOf(skill.range.value),
									newIndex = Math.min(index + this.props.perks.range.current, keys.length - 1);

								return (
									<span className="text-success">
										<strong>
											{this.props.metadata.range[keys[newIndex]]}
										</strong>
									</span>
								);
							} else {
								return skill.range.rendered;
							}
						}.bind(this)()}

						{(skill.perks[0].range && this.props.perks) ? (
							<PerkButtonGroup
								currentLevel = {this.props.perks.range.current}
								maxLevel = {this.props.perks.range.max}
								cost = {this.skillLevel+1}
								onPerkUpClick = {this.onPerkButtonClick.bind(this, 'range', 'up')}
								onPerkDownClick = {this.onPerkButtonClick.bind(this, 'range', 'down')}
							/>
						) : null}
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
							{
								// Only display skill level on client side (when character perks are supplied through props)
								(this.props.perks) ? <span className="pull-right">nv. {this.skillLevel+1}</span> : null
							}

							<h2 className="panel-title" dangerouslySetInnerHTML={{__html: skill.title.rendered}} />
							<small>
								<span dangerouslySetInnerHTML={{__html: skill.skill_type.rendered}}></span>&nbsp;|&nbsp;
								<span dangerouslySetInnerHTML={{__html: skill.character_class.title.rendered}}></span>
							</small>
						</div>
						<div className="panel-body">
							{(skill.perks[0].power && this.props.perks) ? (
								<PerkButtonGroup
									currentLevel = {this.props.perks.power.current}
									maxLevel = {this.props.perks.power.max}
									cost = {this.skillLevel+1}
									onPerkUpClick = {this.onPerkButtonClick.bind(this, 'power', 'up')}
									onPerkDownClick = {this.onPerkButtonClick.bind(this, 'power', 'down')}
								/>
							) : null}
							<div dangerouslySetInnerHTML={{__html: this.parseSkillEffect(skill.effect)}} />
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

	/**
	 * Refresh the current skill level.
	 * @param {Object} nextProps The next props about to be applied to the component
	 * @private
	 */
	updateSkillLevel(nextProps) {
		var prop;

		this.skillLevel = 0;
		for (prop in nextProps.perks) {
			if (nextProps.perks.hasOwnProperty(prop)) {
				this.skillLevel += nextProps.perks[prop].current;
			}
		}
	}

	/**
	 * Parses the skill effect for power level instances and injects {@link PerkButtonGroup}
	 * components if needed.
	 * @param {string} effect The skill effect HTML string
	 * @return {jsx} The parsed HTML
	 */
	parseSkillEffect(effect) {
		return effect.replace(/{(\d*)[+-](\d*)NP}/, function(match, basePower, scale) {
			// Set default scale to 1 if it isn't specified
			var intScale = parseInt(scale) || 1;

			// Display a boosted value if the player has at least 1 power level bought
			if (this.props.perks && this.props.perks.power.current) {
				// #SHAME. We have to have HTML as a literal string here for React to render properly
				return basePower +
					'<span class="text-success"><strong>(+' +
					String(intScale * this.props.perks.power.current) +
					')</strong></span>';
			}

			// Display the base value otherwise
			else {
				return basePower;
			}
		}.bind(this));
	}

	/**
	 * Handle perk button clicks
	 * @param {string} property Property being modified. Either `power`, `cast`, `duration`, `range` or `uses`.
	 * @param {string} direction Direction of the modification. Either `up` or `down`.
	 */
	onPerkButtonClick(property, direction) {
		if (this.props.onSelectPerk) {
			this.props.onSelectPerk(this.props.skill.id, property, direction);
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
	}),
	metadata: React.PropTypes.shape({
		cast: React.PropTypes.object.isRequired,
		duration: React.PropTypes.object.isRequired,
		range: React.PropTypes.object.isRequired
	}),

	onSelectPerk: React.PropTypes.func
};
