import Lodash from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * A CharacterSheetSkill displays a single skill with its upgrades in a
 * character sheet ready for print.
 * @class
 */
export default class CharacterSheetSkill extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Default props
	 */
	constructor(props) {
		super(props);

		this.parseSkillEffect = this.parseSkillEffect.bind(this);
	}

	/**
	 * @override
	 * @return {html} The component template
	 */
	render() {
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
			}(this.props.skill.cost[0]),

			castRow = (this.props.skill.cast.rendered) ? (
				<li className="list-group-item">
					<strong>Incantation</strong>:&nbsp;

					{function() {
						// Short circuit if invalid perks were supplied
						if (!this.props.pickedPerks) {
							return this.props.skill.cast.rendered;
						}

						var intPerkCast = parseInt(this.props.pickedPerks.cast) || 0;

						// Display boosted value if perks were bought
						if (intPerkCast) {
							var keys = Object.keys(this.props.metadata.cast),
								index = keys.indexOf(this.props.skill.cast.value),
								newIndex = Math.max(index - intPerkCast, 0);

							return (
								<span className="text-success">
									<strong>
										{this.props.metadata.cast[keys[newIndex]]}
									</strong>
								</span>
							);
						} else {
							return this.props.skill.cast.rendered;
						}
					}.bind(this)()}
				</li>
			) : null,

			durationRow = (this.props.skill.duration.rendered) ? (
				<li className="list-group-item">
					<strong>Durée</strong>:&nbsp;

					{function() {
						// Short circuit if invalid perks were supplied
						if (!this.props.pickedPerks) {
							return this.props.skill.duration.rendered;
						}

						var intPerkDuration = parseInt(this.props.pickedPerks.duration) || 0;

						// Display boosted value if perks were bought
						if (intPerkDuration) {
							var keys = Object.keys(this.props.metadata.duration),
								index = keys.indexOf(this.props.skill.duration.value),
								newIndex = Math.min(index + intPerkDuration, keys.length - 1);

							return (
								<span className="text-success">
									<strong>
										{this.props.metadata.duration[keys[newIndex]]}
									</strong>
								</span>
							);
						} else {
							return this.props.skill.duration.rendered;
						}
					}.bind(this)()}
				</li>
			) : null,

			usesRow = (this.props.skill.uses[0].amount) ? (
				<li className="list-group-item">
					<strong>Utilisations</strong>:&nbsp;

					{function() {
						// Short circuit if invalid perks were supplied
						if (!this.props.pickedPerks) {
							return this.props.skill.uses[0].amount;
						}

						var intPerkUses = parseInt(this.props.pickedPerks.uses) || 0;

						// Display boosted value if perks were bought
						if (intPerkUses) {
							return (
								<span className="text-success">
									<strong>
										{parseInt(this.props.skill.uses[0].amount) + intPerkUses}
									</strong>
								</span>
							);
						} else {
							return this.props.skill.uses[0].amount;
						}
					}.bind(this)()}
					/{this.props.skill.uses[0].type.rendered}
				</li>
			) : null,

			rangeRow = (this.props.skill.range.rendered) ? (
				<li className="list-group-item">
					<strong>Portée</strong>:&nbsp;

					{function() {
						// Short circuit if invalid perks were supplied
						if (!this.props.pickedPerks) {
							return this.props.skill.range.rendered;
						}

						var intPerkRange = parseInt(this.props.pickedPerks.range) || 0;

						// Display boosted value if perks were bought
						if (intPerkRange) {
							var keys = Object.keys(this.props.metadata.range),
								index = keys.indexOf(this.props.skill.range.value),
								newIndex = Math.min(index + intPerkRange, keys.length - 1);

							return (
								<span className="text-success">
									<strong>
										{this.props.metadata.range[keys[newIndex]]}
									</strong>
								</span>
							);
						} else {
							return this.props.skill.range.rendered;
						}
					}.bind(this)()}
				</li>
			) : null;

		return (
			<li className="panel panel-default">
				<div className="panel-heading">
					<h4 className="panel-title">
						{this.props.skill.title.rendered}
					</h4>
					<small>
						{this.props.skill.skill_type.rendered}
						{/* TODO: Add character class here */}
					</small>
				</div>
				<div className="panel-body ta-skill-effect" dangerouslySetInnerHTML={{__html: this.parseSkillEffect(this.props.skill.effect)}} />
				{(costRow || castRow || usesRow || durationRow || rangeRow) ?
					<ul className="list-group">
						{costRow}
						{castRow}
						{usesRow}
						{durationRow}
						{rangeRow}
					</ul>
					: <noscript/>
				}
				{this.props.pickedUpgrades.map(function(upgradeID) {
					var upgradeData = this.props.skill.upgrades[parseInt(upgradeID)-1];

					return (
						<div
							key = {upgradeID}
							className = "panel-body ta-skill-upgrade"
						>
							<strong>{upgradeData.title}</strong>
							<span dangerouslySetInnerHTML = {{__html: upgradeData.effect}} />
						</div>
					);
				}.bind(this))}
			</li>
		);
	}

	/**
	 * Parses the skill effect for power level instances
	 * @param {string} effect The skill effect HTML string
	 * @return {jsx} The parsed HTML
	 */
	parseSkillEffect(effect) {
		// Short circuit if invalid perks were supplied
		if (!this.props.pickedPerks) {
			return effect;
		}

		return effect.replace(/{(\d*)[+-](\d*)NP}/g, function(match, basePower, scale) {
			var intScale = parseInt(scale) || 1,
				intPerkPower = parseInt(this.props.pickedPerks.power) || 0;

			if (intPerkPower) {
				// #SHAME. We have to have HTML as a literal string here for React to render properly
				return basePower +
					'<span class="text-success"><strong>(+' +
					String(intScale * intPerkPower) +
					')</strong></span>';
			}

			else {
				return basePower;
			}
		}.bind(this));
	}
}

/**
 * @type {Object}
 */
CharacterSheetSkill.propTypes = {
	skill: PropTypes.object.isRequired,
	pickedUpgrades: PropTypes.arrayOf(
		PropTypes.string
	),
	pickedPerks: PropTypes.oneOfType([
		PropTypes.shape({
			power: PropTypes.string.isRequired,
			cast: PropTypes.string.isRequired,
			duration: PropTypes.string.isRequired,
			range: PropTypes.string.isRequired,
			uses: PropTypes.string.isRequired
		}),
		PropTypes.bool
	]).isRequired,
	metadata: PropTypes.shape({
		cast: PropTypes.object.isRequired,
		duration: PropTypes.object.isRequired,
		range: PropTypes.object.isRequired
	})
};
