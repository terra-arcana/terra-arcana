import React from 'react';

import CharacterSkillsPanelSkillElement from './character-skills-panel-skill-element.jsx';

require('../../styles/toile/character-skills-panel.scss');

/**
 * A character skills panel displays details about a character and all her 
 * skills currently selected.
 *
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
	}

	/**
	 * @override
	 * @param {Object} props New props
	 */
	componentWillReceiveProps(props) {
		var skills = [],
			splitID;

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
				skills[splitID[0]].upgrades.push({
					id: splitID[1]
				});
			}
		}

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
			skillsList = null;

		if (this.state.displaySkills) {
			skillsList = (
				<ul className='list-group skills-list'>
					{this.state.skills.map(function(skill) {
						return (
							<CharacterSkillsPanelSkillElement
								id = {skill.id}
								upgrades = {skill.upgrades}
								onMouseOver = {this.props.onMouseOver}
								onMouseOut = {this.props.onMouseOut}
							></CharacterSkillsPanelSkillElement>
						);
					}.bind(this))}
				</ul>
			);
		}

		return (
			<div className='toile-editor-character-skills-panel'>
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h2 className='panel-title'>
							{this.props.characterName}
							<small> Gars badass</small>
						</h2>
					</div>

					<div className='panel-body'>
						<ul>
							<li>Points d'énergie: {this.props.energy}</li>
							<li>Points d'expérience: {this.props.xp.current}/{this.props.xp.total}</li>
							<li>Points dessence: {this.props.pp.current}/{this.props.pp.total}</li>
						</ul>

						<h3>Compétences <button className='btn btn-link btn-sm' onClick={this.toggleSkills}>{toggleSkillsButtonText}</button></h3>
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
}

/**
 * Default props
 * 
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
