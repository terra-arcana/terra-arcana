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
		for (var i = 0; i < props.nodes.length; i++) {
			splitID = props.nodes[i].split('-');

			// Create skill stub if it doesn't exist
			if (skills[splitID[0]] === undefined) {
				skills[splitID[0]] = {
					id: splitID[0],
					upgrades: []
				};
			}

			// Add upgrade to parent skill if is an upgrade
			if (splitID[1] !== undefined) {
				skills[splitID[0]].upgrades.push(splitID[1]);
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
				<ul className='list-group skills-list'>
					{this.state.skills.map(function(skill) {
						return (
							<CharacterSkillsPanelSkillElement
								key = {skill.id}
								id = {skill.id}
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
			<div className="skill-graph-editor-character-skills-panel">
				<div className="panel panel-default">
					<div className="panel-body">
						<ul>
							<li>
								<h4>
									<span className="glyphicon glyphicon-certificate"></span>&nbsp;
									Points d'expérience: {this.props.xp.current}/{this.props.xp.total}
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
								<h4>
									<span className="glyphicon glyphicon-fire"></span>&nbsp;
									Points d'essence: {this.props.pp.current}/{this.props.pp.total}
								</h4>
								<div className="progress">
									<div
										className = {'progress-bar progress-bar-' + ppBarClass}
										role = "progressbar"
										aria-valuenow = {this.props.pp.current}
										aria-valuemin = "0"
										aria-valuemax = {this.props.pp.total}
										style = {{width: (100 * this.props.pp.current/this.props.pp.total) + '%' }}
									/>
								</div>
							</li>
							<li>
								<h4>
									<span className="glyphicon glyphicon-heart"></span>&nbsp;
									Points d'énergie: {this.props.energy}
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
		if (this.props.activeSkill.id !== info.id) {
			if (this.props.onSelectSkill) {
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
	nodes: [],
	energy: 8,
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
	characterName: React.PropTypes.string.isRequired,
	characterPeople: React.PropTypes.shape({
		id: React.PropTypes.number.isRequired,
		name: React.PropTypes.string.isRequired,
		singular: React.PropTypes.string.isRequired
	}).isRequired,
	nodes: React.PropTypes.arrayOf(
		React.PropTypes.string
	),
	energy: React.PropTypes.number,
	xp: React.PropTypes.shape({
		current: React.PropTypes.number.isRequired,
		total: React.PropTypes.number.isRequired
	}),
	pp: React.PropTypes.shape({
		current: React.PropTypes.number.isRequired,
		total: React.PropTypes.number.isRequired
	}),
	activeSkill: React.PropTypes.object,

	onSelectSkill: React.PropTypes.func,
	onUnselectSkill: React.PropTypes.func,
	onSaveClick: React.PropTypes.func
};
