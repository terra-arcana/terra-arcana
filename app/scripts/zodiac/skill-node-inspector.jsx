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
		this.fetchSkillRequest = jQuery.get('http://' + location.hostname + '/wp-json/wp/v2/skill/' + skillID, function(result) {
			this.setState({
				skill: result
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		if (!jQuery.isEmptyObject(this.state.skill)) {
			var skill = this.state.skill,
				upgradeButton = (<a className='btn btn-default btn-xs' href='#' role='button'>Améliorer</a>);

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
						<tr>
							<td>Coût {(skill.perks[0].cost) ? upgradeButton : null}</td>
							<td>{costElements.join(', ')}</td>
						</tr>
					) : null;
				}(skill.cost[0]),

				castRow = (skill.cast.rendered) ? (
					<tr>
						<td>Incantation {(skill.perks[0].cast) ? upgradeButton : null}</td>
						<td>{skill.cast.rendered}</td>
					</tr>
				) : null,

				durationRow = (skill.duration.rendered) ? (
					<tr>
						<td>Durée {(skill.perks[0].duration) ? upgradeButton : null}</td>
						<td>{skill.duration.rendered}</td>
					</tr>
				) : null,

				usesRow = (skill.uses[0].amount) ? (
					<tr>
						<td>Utilisations {(skill.perks[0].uses) ? upgradeButton : null}</td>
						<td>{skill.uses[0].amount}/{skill.uses[0].type.rendered}</td>
					</tr>
				) : null,

				rangeRow = (skill.range.rendered) ? (
					<tr>
						<td>Portée {(skill.perks[0].range) ? upgradeButton : null}</td>
						<td>{skill.range.rendered}</td>
					</tr>
				) : null,

				skillInfoTable = (costRow || castRow || durationRow || usesRow || rangeRow) ? 
				(
					<table className='skill-details-table table table-bordered table-condensed'>
						<tbody>
							{costRow}
							{usesRow}
							{castRow}
							{durationRow}
							{rangeRow}
						</tbody>
					</table>
				) :
				null;

			return (
				<div className='col-sm-12 col-lg-4 skill-graph-editor-skill-node-inspector'>
					{this.props.skill.upgrades.map(function(upgrade) {
						return (
							<div key={upgrade} className='panel panel-info upgrade-panel'>
								<div className='panel-heading'>
									<h3 className='panel-title' dangerouslySetInnerHTML={{__html: skill.upgrades[upgrade-1].title}}></h3>
								</div>
								<div className='panel-body' dangerouslySetInnerHTML={{__html: skill.upgrades[upgrade-1].effect}}></div>
							</div>
						);
					}.bind(this))}

					<div className='panel panel-default'>
						<div className='panel-heading'>
							<h2 className='panel-title'><span dangerouslySetInnerHTML={{__html: skill.title.rendered}}></span>&emsp;
								<small>
									<span dangerouslySetInnerHTML={{__html: skill['skill_type'].rendered}}></span>&nbsp;|&nbsp;
									<span>[SIGNE]</span>
								</small>
							</h2>
						</div>
						<div className='panel-body'>
							<div dangerouslySetInnerHTML={{__html: skill.effect}}></div>
							{skillInfoTable}
							<em dangerouslySetInnerHTML={{__html: skill['flavor_text']}}></em>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className='col-sm-12 col-lg-4 skill-graph-editor-skill-node-inspector'>
					<div className='panel panel-default'>
						<div className='panel-heading'>
							<h2 className='panel-title'>Chargement...</h2>
						</div>
						<div className='panel-body'>
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
	})
};
