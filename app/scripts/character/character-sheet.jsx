import React from 'react';

import CharacterSheetSkill from './character-sheet-skill.jsx';

require('../../styles/character/character-sheet.page.scss');
require('../../images/zodiac/perk-black.png');

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
			skillInfo: [],
			pickedUpgradesIDMap: {},
			authorName: ''
		};

		this.getSortedSkills = this.getSortedSkills.bind(this);
	}

	/**
	 * @override
	 */
	componentWillMount() {
		var i, len, skillInfo, skillInfoRequest, authorRequest, splitID,
			upgradeIDMap = {},
			skillIDs = [],
			authorName = '',
			currentBuild = this.props.character.current_build;

		for (i = 0, len = currentBuild.length; i < len; i++) {
			splitID = currentBuild[i].id.split('-');
			if (!Array.isArray(upgradeIDMap[splitID[0]])) {
				upgradeIDMap[splitID[0]] = [];
			}

			if (currentBuild[i].type === 'skill') {
				skillIDs.push(currentBuild[i].id);
			} else if (currentBuild[i].type === 'upgrade') {
				upgradeIDMap[splitID[0]].push(splitID[1]);
			}
		}

		this.setState({
			pickedUpgradesIDMap: upgradeIDMap
		});

		skillInfoRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/skill?include=' + skillIDs.join(','), function(result) {
			skillInfo = result;
		}.bind(this));

		authorRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/users/' + this.props.character.author, function(result) {
			authorName = result.name;
		}.bind(this));

		jQuery.when(skillInfoRequest, authorRequest).done(function() {
			this.setState({
				skillInfo: skillInfo,
				authorName: authorName
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {html} The component template
	 */
	render() {
		var skillList = this.getSortedSkills(),
			instants = <span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />,
			buffs = <span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />,
			passives = <span className="glyphicon glyphicon-asterisk glyphicon-spin text-center" />;

		if (skillList) {
			instants = (
				<ul>
					{skillList.instants.map(function(skill) {
						return (
							<CharacterSheetSkill
								key = {skill.id}
								skill = {skill}
								pickedUpgrades = {this.state.pickedUpgradesIDMap[skill.id]}
							/>
						);
					}.bind(this))}
				</ul>
			);
			buffs = (
				<ul>
					{skillList.buffs.map(function(skill) {
						return (
							<CharacterSheetSkill
								key = {skill.id}
								skill = {skill}
								pickedUpgrades = {this.state.pickedUpgradesIDMap[skill.id]}
							/>
						);
					}.bind(this))}
				</ul>
			);
			passives = (
				<ul>
					{skillList.passives.map(function(skill) {
						return (
							<CharacterSheetSkill
								key = {skill.id}
								skill = {skill}
								pickedUpgrades = {this.state.pickedUpgradesIDMap[skill.id]}
							/>
						);
					}.bind(this))}
				</ul>
			);
		}

		return (
			<div className="ta-character-sheet">
				<div className="col-xs-12 no-print">
					<a href="#" className="btn btn-primary btn-sm" onClick={() => window.print()}>
						<span className="glyphicon glyphicon-print no-events" />
						<span className="no-events">&nbsp;Imprimer</span>
					</a>
				</div>

				<div className="col-xs-12">
					<div className="row">
						<h2 className="col-xs-9">
							<strong>{this.props.character.title.rendered}</strong>&nbsp;
							<ul className="list-inline ta-character-stats-badge">
								<li className="list-group-item">
									<span className="glyphicon glyphicon-plus" />&nbsp;
									<strong>8</strong>
								</li>
								<li className="list-group-item ta-seethrough">
									<span className="glyphicon glyphicon-certificate" />&nbsp;
									{this.props.character.xp.total}
								</li>
								<li className="list-group-item ta-seethrough">
									<img className="ta-perk-icon-img" src={WP_Theme_Settings.imageRoot + 'perk-black.png'} />&nbsp;
									{this.props.character.perk_points.total}
								</li>
							</ul>
							<br/><small>Incarné par {this.state.authorName}</small>
						</h2>

						<img className="col-xs-3 pull-right" src={WP_Theme_Settings.imageRoot + 'terra-login-logo.png'} />
					</div>
				</div>

				<div className="ta-skills-list">
					<div className="ta-skills-list-col col-xs-4">
						<h3 className="text-center"><br/><br/>Instants</h3>
						{instants}
					</div>
					<div className="ta-skills-list-col col-xs-4">
						<h3 className="text-center">
							Puissances <small>1</small><br/>
							Inspirations <small>1</small><br/>
							Enchantements <small>2</small>
						</h3>
						{buffs}
					</div>
					<div className="ta-skills-list-col col-xs-4">
						<h3 className="text-center"><br/>Formes<br/>Passifs</h3>
						{passives}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Get the sorted skill list ready for render
	 * @return {Object} The sorted skill list, by `instants`, `buffs` and `passives` keys
	 */
	getSortedSkills() {
		var i, len, skill,
			skillList = {
				instants: [],
				buffs: [],
				passives: []
			};

		// Sort skills
		for (i = 0, len = this.state.skillInfo.length; i < len; i++) {
			skill = this.state.skillInfo[i];

			switch(skill.skill_type.value) {
			case 'instant':
				skillList.instants.push(skill);
				break;
			case 'self-buff':
			case 'ally-buff':
			case 'item-buff':
				skillList.buffs.push(skill);
				break;
			case 'form':
			case 'passive':
				skillList.passives.push(skill);
				break;
			}
		}

		return skillList;
	}
}

/**
 * @type {Object}
 */
CharacterSheet.propTypes = {
	character: React.PropTypes.object.isRequired
};
