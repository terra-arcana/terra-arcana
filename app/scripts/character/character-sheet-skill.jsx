import React from 'react';
import Lodash from 'lodash';

/**
 * A CharacterSheetSkill displays a single skill with its upgrades in a
 * character sheet ready for print.
 * @class
 */
export default class CharacterSheetSkill extends React.Component {

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
						// Display boosted value if perks were bought
						if (this.props.perks && this.props.perks.cast.current) {
							var keys = Object.keys(this.props.metadata.cast),
								index = keys.indexOf(this.props.skill.cast.value),
								newIndex = Math.max(index - this.props.perks.cast.current, 0);

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
						// Display boosted value if perks were bought
						if (this.props.perks && this.props.perks.duration.current) {
							var keys = Object.keys(this.props.metadata.duration),
								index = keys.indexOf(this.props.skill.duration.value),
								newIndex = Math.min(index + this.props.perks.duration.current, keys.length - 1);

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
					{
						// Display boosted value if perks were bought
						(this.props.perks && this.props.perks.uses.current) ? (
						<span className="text-success">
							<strong>
								{parseInt(this.props.skill.uses[0].amount) + parseInt(this.props.perks.uses.current)}
							</strong>
						</span>
					) : this.props.skill.uses[0].amount}

					/{this.props.skill.uses[0].type.rendered}
				</li>
			) : null,

			rangeRow = (this.props.skill.range.rendered) ? (
				<li className="list-group-item">
					<strong>Portée</strong>:&nbsp;

					{function() {
						// Display boosted value if perks were bought
						if (this.props.perks && this.props.perks.range.current) {
							var keys = Object.keys(this.props.metadata.range),
								index = keys.indexOf(this.props.skill.range.value),
								newIndex = Math.min(index + this.props.perks.range.current, keys.length - 1);

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
				<div className="panel-body ta-skill-effect" dangerouslySetInnerHTML={{__html: this.props.skill.effect}} />
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
			</li>
		)
	}
}

/**
 * @type {Object}
 */
CharacterSheetSkill.propTypes = {
	skill: React.PropTypes.object.isRequired
};
