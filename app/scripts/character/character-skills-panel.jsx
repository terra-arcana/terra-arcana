import PropTypes from 'prop-types';
import React from 'react';

import CharacterSkillsPanelSkillElement from './character-skills-panel-skill-element.jsx';

require('../../styles/character/character-skills-panel.scss');

/**
 * A CharacterSkillsPanel displays details about a character and all her
 * skills currently selected.
 * @class
 */
export default class CharacterSkillsPanel extends React.Component {

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
			skills: [],
			displaySkills: true
		};

		this.toggleSkills = this.toggleSkills.bind(this);
		this.onSelectSkill = this.onSelectSkill.bind(this);
	}

	/**
	 * @override
	 * @param {Object} props New props
	 */
	componentWillReceiveProps(props) {
		var skills = [],
			splitID;

		// Build new skill list based on nodes received from props
		for (var i = 0; i < props.skills.length; i++) {
			splitID = props.skills[i].id.split('-');

			// Create skill stub if it doesn't exist
			if (skills[splitID[0]] === undefined) {
				skills[splitID[0]] = {
					id: splitID[0],
					name: props.skills[i].name,
					upgrades: []
				};
			}

			// Add upgrade to parent skill if is an upgrade
			if (splitID[1] !== undefined) {
				skills[splitID[0]].upgrades.push({
					id: splitID[1],
					name: props.skills[i].name
				});
			}
		}

		// Update state
		this.setState({
			skills: skills
		});
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var toggleSkillsButtonText = this.state.displaySkills ? 'Masquer' : 'Afficher',
			skillsList = null,
			xpBarClass = 'success',
			ppBarClass = 'success';

		if (this.state.displaySkills) {
			skillsList = (
				<ul className='list-group ta-skills-list'>
					{this.state.skills.map(function(skill) {
						return (
							<CharacterSkillsPanelSkillElement
								key = {skill.id}
								id = {skill.id}
								name = {skill.name}
								upgrades = {skill.upgrades}
								active = {skill.id === this.props.activeSkill.id}
								onSelect = {this.onSelectSkill}
							/>
						);
					}.bind(this))}
				</ul>
			);
		}

		if (this.props.xp.current/this.props.xp.total < 0.25) {
			xpBarClass = 'danger';
		} else if (this.props.xp.current/this.props.xp.total < 0.5) {
			xpBarClass = 'warning';
		}

		if (this.props.pp.current/this.props.pp.total < 0.25) {
			ppBarClass = 'danger';
		} else if (this.props.pp.current/this.props.pp.total < 0.5) {
			ppBarClass = 'warning';
		}

		return (
			<div className="ta-skill-graph-editor-character-skills-panel">
				<div className="panel panel-default">
					<div className="panel-body">
						<ul>
							<li>
								<h4>
									<span className="glyphicon glyphicon-certificate"></span>&nbsp;
									Points d&apos;expérience: {this.props.xp.current}/{this.props.xp.total}
								</h4>
								<div className="progress">
									<div
										className = {'progress-bar progress-bar-' + xpBarClass}
										role = "progressbar"
										aria-valuenow = {this.props.xp.current}
										aria-valuemin = "0"
										aria-valuemax = {this.props.xp.total}
										style = {{ width: (100 * this.props.xp.current/this.props.xp.total) + '%' }}
									/>
								</div>
							</li>
							<li>
								<h4 className={(this.props.pp.current < 0) ? 'text-danger' : ''}>
									<span className="ta-perk-icon"></span>&nbsp;
									Points d&apos;essence: {this.props.pp.current}/{this.props.pp.total}
								</h4>
								<div className="progress">
									<div
										className = {'progress-bar progress-bar-' + ppBarClass}
										role = "progressbar"
										aria-valuenow = {this.props.pp.current}
										aria-valuemin = "0"
										aria-valuemax = {this.props.pp.total}
										style = {{width: Math.max((100 * this.props.pp.current/this.props.pp.total), 0) + '%' }}
									/>
								</div>
							</li>
							<li>
								<h4>
									<span className="glyphicon glyphicon-heart"></span>&nbsp;
									Points d&apos;énergie: {this.props.energy}
								</h4>
							</li>
						</ul>

						<h3>
							Compétences&nbsp;
							<button type="button" className="btn btn-link btn-sm" onClick={this.toggleSkills}>{toggleSkillsButtonText}</button>
						</h3>
					</div>

					{skillsList}
				</div>
			</div>
		);
	}

	/**
	 * Toggles display of the skills list
	 */
	toggleSkills() {
		this.setState({
			displaySkills: !this.state.displaySkills
		});
	}

	/**
	 * Select a skill in the list and display its details
	 * @param {Object} info The skill info, with its id and selected upgrades
	 */
	onSelectSkill(info) {
		var i, len;

		if (this.props.activeSkill.id !== info.id) {
			if (this.props.onSelectSkill) {
				// Convert back upgrades array to a flat array
				for (i = 0, len = info.upgrades.length; i < len; i++) {
					info.upgrades[i] = info.upgrades[i].id;
				}

				this.props.onSelectSkill(info);
			}
		} else {
			if (this.props.onUnselectSkill) {
				this.props.onUnselectSkill();
			}
		}
	}
}

/**
 * @type {Object}
 */
CharacterSkillsPanel.defaultProps = {
	characterName: 'Boba Fett',
	skills: [],
	xp: {
		current: 0,
		total: 0
	},
	pp: {
		current: 0,
		total: 0
	}
};

/**
 * @type {Object}
 */
CharacterSkillsPanel.propTypes = {
	characterName: PropTypes.string.isRequired,
	characterPeople: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		singular: PropTypes.string.isRequired
	}).isRequired,
	skills: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		})
	),
	xp: PropTypes.shape({
		current: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired
	}),
	pp: PropTypes.shape({
		current: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired
	}),
	energy: PropTypes.number.isRequired,
	activeSkill: PropTypes.object,

	onSelectSkill: PropTypes.func,
	onUnselectSkill: PropTypes.func,
	onSaveClick: PropTypes.func
};
