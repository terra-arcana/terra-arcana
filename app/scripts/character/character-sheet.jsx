import PropTypes from 'prop-types';
import React from 'react';

import CharacterSheetSkill from './character-sheet-skill.jsx';
import { getPrimaryCharacterClassFromSkills } from './inc/character-class.query.jsx';

import { InlineSpinner } from '../layout/spinner.jsx';

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
			authorName: '',
			graphMetadata: {},
			primaryCharacterClassName: ''
		};

		this.getSortedSkills = this.getSortedSkills.bind(this);
	}

	/**
	 * @override
	 */
	componentWillMount() {
		var i, len, skillInfo, splitID,
			skillsRequest, authorRequest, graphMetadataRequest,
			upgradeIDMap = {},
			graphMetadata = {},
			skillIDs = [],
			authorName = '',
			primaryCharacterClassName = '',
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

		skillsRequest = (() => {
			let deferred = jQuery.Deferred();

			jQuery.get(WP_API_Settings.root + 'wp/v2/skill?per_page=100&include=' + skillIDs.join(','), function(result) {
				skillInfo = result;

				getPrimaryCharacterClassFromSkills(skillInfo).done(function(result) {
					primaryCharacterClassName = result.title.rendered;
					deferred.resolve();
				}.bind(this));
			}.bind(this));

			return deferred.promise();
		})();

		authorRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/users/' + this.props.character.author, function(result) {
			authorName = result.name;
		}.bind(this));

		graphMetadataRequest = jQuery.get(WP_API_Settings.root + 'terraarcana/v1/graph-data', function(result) {
			graphMetadata = result.meta;
		}.bind(this));

		jQuery.when(skillsRequest, authorRequest, graphMetadataRequest).done(function() {
			this.setState({
				pickedUpgradesIDMap: upgradeIDMap,
				skillInfo: skillInfo,
				authorName: authorName,
				graphMetadata: graphMetadata,
				primaryCharacterClassName: primaryCharacterClassName
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {html} The component template
	 */
	render() {
		var skillList = this.getSortedSkills(),
			instants = <InlineSpinner />,
			buffs = <InlineSpinner />,
			passives = <InlineSpinner />,
			tagline = '';

		if (skillList) {
			instants = (
				<ul>
					{skillList.instants.map(function(skill) {
						return (
							<CharacterSheetSkill
								key = {skill.id}
								skill = {skill}
								pickedUpgrades = {this.state.pickedUpgradesIDMap[skill.id]}
								pickedPerks = {skill.pickedPerks[0] || false}
								metadata = {this.state.graphMetadata}
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
								pickedPerks = {skill.pickedPerks[0] || false}
								metadata = {this.state.graphMetadata}
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
								pickedPerks = {skill.pickedPerks[0] || false}
								metadata = {this.state.graphMetadata}
							/>
						);
					}.bind(this))}
				</ul>
			);
		}

		if (   this.state.primaryCharacterClassName
			&& this.state.authorName)
		{
			tagline = this.state.primaryCharacterClassName + ' ' 
					+ this.props.character.people.singular + '<br>'
					+ 'Incarné par <strong>' + this.state.authorName + '</strong>';
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
									<strong>{this.props.character.energy.total}</strong>
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
							<br/><small dangerouslySetInnerHTML={{__html: tagline}} />
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
		var i, ilen, j, jlen, skill,
			skillList = {
				instants: [],
				buffs: [],
				passives: []
			};

		// Sort skills
		for (i = 0, ilen = this.state.skillInfo.length; i < ilen; i++) {
			skill = this.state.skillInfo[i];

			// Overload with picked perks
			for (j = 0, jlen = this.props.character.current_build.length; j < jlen; j++) {
				if (this.props.character.current_build[j].id === String(skill.id)) {
					skill.pickedPerks = this.props.character.current_build[j].perks;
					break;
				}
			}

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
	character: PropTypes.object.isRequired
};
