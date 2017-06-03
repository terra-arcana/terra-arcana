import Lodash from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import SkillGraph from '../zodiac/skill-graph.jsx';
import SkillNodeInspector from '../zodiac/skill-node-inspector.jsx';
import PointNodeInspector from '../zodiac/point-node-inspector.jsx';
import CharacterSkillsPanel from './character-skills-panel.jsx';

require('../../styles/character/character-builder.scss');

/**
 * A CharacterBuilderPage allows editing of a character build by displaying a {@link SkillGraph} that
 * enabled conditional node picking by adjacency rules.
 * @class
 */
export default class CharacterBuilder extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * Base energy granted to all characters
		 * @type {Number}
		 * @private
		 */
		this.BASE_ENERGY = 8;

		this.inspectSkill = this.inspectSkill.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.selectNode = this.selectNode.bind(this);
		this.selectPerk = this.selectPerk.bind(this);
		this.getNodeDataById = this.getNodeDataById.bind(this);
		this.getNodePerkLevels = this.getNodePerkLevels.bind(this);
		this.getPickedNodesFlatArray = this.getPickedNodesFlatArray.bind(this);
		this.getPickedSkillsUpgradesArray = this.getPickedSkillsUpgradesArray.bind(this);
		this.getTriangular = this.getTriangular.bind(this);
		this.filterUnpickedStartingNodes = this.filterUnpickedStartingNodes.bind(this);
		this.calculateCurrentPerkBalance = this.calculateCurrentPerkBalance.bind(this);
		this.calculateCurrentEnergy = this.calculateCurrentEnergy.bind(this);
		this.updatePrimaryCharacterClassName = this.updatePrimaryCharacterClassName.bind(this);
		this.saveBuild = this.saveBuild.bind(this);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			},
			currentBuild: props.character['current_build'] || [],
			nodeData: [],
			linkData: [],
			graphMetadata: {},
			perkPoints: {
				current: 0,
				total: 0
			},
			energy: this.BASE_ENERGY,
			alert: undefined,
			primaryCharacterClassName: ''
		};
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var inspector = <noscript />,
			alert = <noscript />,
			xpValues = {
				// Account for the starting skill and the auto skill, hence the `-2`
				current: this.props.character.xp.total - (this.state.currentBuild.length - 2),
				total: this.props.character.xp.total
			};

		if (this.state.activeNode.id !== '') {
			switch(this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				inspector = (
					<SkillNodeInspector
						skill = {this.state.activeNode}
						perks = {this.getNodePerkLevels(this.state.activeNode.id)}
						metadata = {this.state.graphMetadata}
						onSelectPerk = {this.selectPerk}
					/>
				);
				break;
			case 'perk':
			case 'life':
				inspector = (
					<PointNodeInspector
						pointNode = {this.getNodeDataById(this.state.activeNode.id)}
					/>
				);
			}
		}

		if (this.state.alert !== undefined) {
			var alertClass, iconClass;

			if (this.state.alert.type === 'loading') {
				alertClass = 'alert-warning';
				iconClass = 'glyphicon-asterisk glyphicon-spin';
			} else if (this.state.alert.type === 'success') {
				alertClass = 'alert-success';
				iconClass = 'glyphicon-ok';
			} else if (this.state.alert.type === 'error') {
				alertClass = 'alert-danger';
				iconClass = 'glyphicon-exclamation-sign';
			}

			alert = (
				<div className="col-xs-12 col-lg-4">
					<div className={'alert ' + alertClass}>
						<span className={'glyphicon ' + iconClass} />
						&nbsp;{this.state.alert.message}
					</div>
				</div>
			);
		}

		return (
			<div className="ta-character-zodiac">
				<div className="character-builder-skill-graph-panel col-lg-8">
					<div className="panel panel-default">
						<div className="panel-heading">
							<button
								type = "button"
								className = "btn btn-success pull-right"
								onClick = {this.saveBuild}
								>
								<span className="glyphicon glyphicon-floppy-save"></span>
								&nbsp;Sauvegarder
							</button>
							<h2 className="panel-title">{this.props.character.title.rendered}</h2>
							<small dangerouslySetInnerHTML={{__html: (this.state.primaryCharacterClassName) 
								? this.state.primaryCharacterClassName + '&nbsp;' + this.props.character.people.singular 
								: '&nbsp;'}}
							/>
						</div>

						<div className="panel-body">
							<SkillGraph
								initialNodeData = {this.state.nodeData}
								initialLinkData = {this.state.linkData}
								pickedNodes = {this.getPickedNodesFlatArray()}
								contiguousSelection = {true}
								onNodeMouseOver = {this.inspectSkill}
								onNodeMouseOut = {this.uninspect}
								onNodeSelect = {this.selectNode}
							/>
						</div>
					</div>
				</div>

				{alert}
				{inspector}

				<CharacterSkillsPanel
					characterName = {this.props.character.title.rendered}
					characterPeople = {this.props.character.people}
					skills = {this.getPickedSkillsUpgradesArray()}
					xp = {xpValues}
					pp = {this.state.perkPoints}
					energy = {this.state.energy}
					activeSkill = {this.state.activeNode}
					onSelectSkill = {this.inspectSkill}
					onUnselectSkill = {this.uninspect}
					onSaveClick = {this.saveBuild}
				/>
			</div>
		);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var nodeData = [],
			linkData = [],
			graphMetadata = {},
			startingSkills = [],

			graphDataRequest = jQuery.get(WP_API_Settings.root + 'terraarcana/v1/graph-data', function(result) {
				nodeData = result.nodes;
				linkData = result.links;
				graphMetadata = result.meta;
			}.bind(this)),

			startingSkillsRequest = jQuery.get(WP_API_Settings.root + 'terraarcana/v1/starting-skills', function(result) {
				startingSkills = result;
			}.bind(this));

		jQuery.when(graphDataRequest, startingSkillsRequest).done(function() {
			nodeData = this.filterUnpickedStartingNodes(
				nodeData,
				startingSkills,
				this.props.character['picked_starting_skill']
			);

			this.setState({
				nodeData: nodeData,
				linkData: linkData,
				graphMetadata: graphMetadata,
				startingSkills: startingSkills
			});

			// Now that `this.state.nodeData` exists, we can calculate the perk points
			this.setState({
				energy: this.calculateCurrentEnergy(this.state.currentBuild),
				perkPoints: this.calculateCurrentPerkBalance(this.state.currentBuild)
			});

			// Now that `this.state.nodeData` exists, we can calculate the primary character class
			this.updatePrimaryCharacterClassName();
		}.bind(this));
	}

	/**
	 * Inspect a node and reveal its details
	 * @param {String|Object} node The picked node(s)
	 */
	inspectSkill(node) {
		var nodeData, splitID, nodeObj;

		if (typeof node === 'string') {
			nodeData = this.getNodeDataById(node);
			splitID = node.split('-'),
			nodeObj = {
				id: splitID[0],
				type: nodeData.type,
				upgrades: []
			};

			if (nodeData.type === 'skill' || nodeData.type === 'upgrade') {
				if (splitID[1] !== undefined) {
					nodeObj.upgrades.push(splitID[1]);
				}
			}
		} else {
			nodeData = this.getNodeDataById(node.id);
			nodeObj = {
				id: node.id,
				type: nodeData.type,
				upgrades: node.upgrades
			};
		}

		this.setState({
			activeNode: nodeObj
		});
	}

	/**
	 * Stop inspecting skills
	 */
	uninspect() {
		this.setState({
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			}
		});
	}

	/**
	 * Select a node
	 * @param {String} id The picked node ID
	 */
	selectNode(id) {
		var i, len,
			nodeIndex = -1,
			nodeData = this.getNodeDataById(id),
			newBuild = Lodash.cloneDeep(this.state.currentBuild);

		// Do nothing with start nodes: those can't be added or deleted from the build
		if (nodeData.start) {
			return;
		}

		// Find node index in current build
		for (i = 0, len = newBuild.length; i < len; i++) {
			if (newBuild[i].id === id) {
				nodeIndex = i;
				break;
			}
		}

		// Add a node to the build
		if (nodeIndex === -1) {
			// Only add a node if there is XP left
			if (newBuild.length - 2 < this.props.character.xp.total) {
				newBuild[newBuild.length] = {
					id: id,
					type: nodeData.type,
					perks: [{
						power: 0,
						cast: 0,
						duration: 0,
						range: 0,
						uses: 0
					}]
				};
			}
		}

		// Remove a node from the build
		else {
			newBuild.splice(nodeIndex, 1);
		}

		this.setState({
			currentBuild: newBuild,
			energy: this.calculateCurrentEnergy(newBuild),
			perkPoints: this.calculateCurrentPerkBalance(newBuild)
		});

		this.updatePrimaryCharacterClassName();
	}

	/**
	 * Select or unselect a perk from a skill
	 * @param {string} id The skill ID
	 * @param {string} property Property being modified. Either `power`, `cast`, `duration`, `range` or `uses`.
	 * @param {string} direction Direction of the modification. Either `up` or `down`.
	 */
	selectPerk(id, property, direction) {
		var i, len,
			newBuild = Lodash.cloneDeep(this.state.currentBuild);

		// Find node
		for (i = 0, len = newBuild.length; i < len; i++) {
			if (newBuild[i].id === id) {
				// Update perk level
				if (direction === 'up') {
					newBuild[i].perks[0][property]++;
				} else {
					newBuild[i].perks[0][property]--;
				}

				break;
			}
		}

		this.setState({
			currentBuild: newBuild,
			perkPoints: this.calculateCurrentPerkBalance(newBuild)
		});
	}

	/**
	 * Return the data of a particular node by ID
	 * @param {String} id The node ID
	 * @return {Object|null} The node data
	 */
	getNodeDataById(id) {
		var i, len, nodeData = null;

		for (i = 0, len = this.state.nodeData.length; i < len; i++) {
			if (this.state.nodeData[i].id === id) {
				nodeData = this.state.nodeData[i];
				break;
			}
		}

		return nodeData;
	}

	/**
	 * Get all the current and max perk levels for a given skill node
	 * @param {string} id The skill node ID
	 * @return {Object|null} The perk data
	 */
	getNodePerkLevels(id) {
		var i, len,
			nodeData = this.getNodeDataById(id),
			buildNode = null,
			perkProp = null,
			perkValue = 0,
			perkLevels = {};

		// Get the corresponding node in the character build
		for (i = 0, len = this.state.currentBuild.length; i < len; i++) {
			if (this.state.currentBuild[i].id === id) {
				buildNode = this.state.currentBuild[i];
				break;
			}
		}

		// Exit early if the node couldn't be found or
		// if the node does not have any perk data
		if (!buildNode || !Array.isArray(buildNode.perks)) return null;

		// Append all perk levels
		for (perkProp in buildNode.perks[0]) {
			if (buildNode.perks[0].hasOwnProperty(perkProp)) {
				perkValue = parseInt(buildNode.perks[0][perkProp]);
				perkLevels[perkProp] = {
					current: (isNaN(perkValue)) ? 0 : perkValue,
					max: nodeData.perks[perkProp]
				};
			}
		}

		return perkLevels;
	}

	/**
	 * Get a flat array of all currently picked nodes
	 * @return {Array} The converted array
	 */
	getPickedNodesFlatArray() {
		var i, len,
			final = [];

		// Exit early on an undefined array
		if (!Array.isArray(this.state.currentBuild)) return [];

		for (i = 0, len = this.state.currentBuild.length; i < len; i++) {
			final.push(this.state.currentBuild[i].id);
		}

		return final;
	}

	/**
	 * Get an array of every skill and upgrade picked by the player
	 * @return {Array} An array of objects containing the `id` and `name` of each skill/upgrade node
	 */
	getPickedSkillsUpgradesArray() {
		var final = [];

		// Exit early on an undefined build
		if (!Array.isArray(this.state.currentBuild)) return [];

		// Exit early if node data isn't built yet
		if (this.state.nodeData.length === 0) return [];

		for (let i = 0, len = this.state.currentBuild.length; i < len; i++) {
			let buildNode = this.state.currentBuild[i],
				buildNodeData = this.getNodeDataById(buildNode.id);

			if (buildNode.type === 'skill' || buildNode.type === 'upgrade') {
				final.push({
					id: buildNode.id,
					name: buildNodeData.name,
					characterClass: buildNodeData['character-class']
				});
			}
		}

		return final;
	}

	/**
	 * Return the triangular value of a number. This is used to calculate the total cost
	 * of perks bought on a single skill.
	 * @param {number} value The number to triangulate
	 * @return {number} The triangular value
	 */
	getTriangular(value) {
		var abs = Math.abs(value);
		return ((abs / 2) * (abs + 1)) * (abs / value) || 0;
	}

	/**
	 * Filter out the node data and replace unpicked starting nodes by life nodes
	 * @param {Array} nodeData The initial node data
	 * @param {Array} startingSkills All the starting skills
	 * @param {Number} pickedStartingSkill The starting skill picked by this character
	 * @return {Array} The filtered node data
	 */
	filterUnpickedStartingNodes(nodeData, startingSkills, pickedStartingSkill) {
		var i, ilen, j, jlen = startingSkills.length,
			filteredNodeData = Lodash.cloneDeep(nodeData);

		for (i = 0, ilen = filteredNodeData.length; i < ilen; i++) {
			for (j = 0; j < jlen; j++) {
				if (filteredNodeData[i].id === String(startingSkills[j].id) &&
					filteredNodeData[i].id !== String(pickedStartingSkill)
				) {
					filteredNodeData[i].type = 'life';
					filteredNodeData[i].value = '2';
					filteredNodeData[i].start = false;
					delete filteredNodeData[i].perks;
					break;
				}
			}
		}

		return filteredNodeData;
	}

	/**
	 * Return the current perk point balance considering all the current purchases in state
	 * @param {Array} build The current character build to analyze
	 * @return {Object} The `current` and `total` amount of perk points available
	 */
	calculateCurrentPerkBalance(build) {
		var i, len, node, skillLevel, perkProp, value,
			pointsSpent = 0,
			totalPoints = parseInt(this.props.character['perk_points'].bonus);

		for (i = 0, len = build.length; i < len; i++) {
			node = build[i];

			// Add perk nodes to the total point count
			if (node.type === 'perk') {
				value = parseInt(this.getNodeDataById(node.id).value);
				totalPoints += (isNaN(value)) ? 0 : value;
			}

			// Add bought skill perks to the points spent count
			else if (node.type === 'skill') {
				skillLevel = 0;

				for (perkProp in node.perks[0]) {
					if (node.perks[0].hasOwnProperty(perkProp)) {
						value = parseInt(node.perks[0][perkProp]);
						skillLevel += (isNaN(value)) ? 0 : value;
					}
				}

				pointsSpent += this.getTriangular(skillLevel);
			}
		}

		return {
			current: totalPoints - pointsSpent,
			total: totalPoints
		};
	}

	/**
	 * Return the current energy totals considering all the current purchases
	 * @param {Array} skillsList The current character build
	 * @return {Number} The amount of energy collected through nodes for this character
	 */
	calculateCurrentEnergy(skillsList) {
		var i, len, skill,
			totalPoints = 0;

		for (i = 0, len = skillsList.length; i < len; i++) {
			skill = skillsList[i];

			if (skill.type === 'life') {
				totalPoints += parseInt(this.getNodeDataById(skill.id).value);
			}
		}

		return this.BASE_ENERGY + totalPoints;
	}

	/**
	 * Computes and updates in state the name of the character class that has the most nodes picked by the character.
	 * @return {string} The character class name
	 */
	updatePrimaryCharacterClassName() {
		var classMap = {},
			pickedNodes = this.getPickedSkillsUpgradesArray();

		for (let i = 0, len = pickedNodes.length; i < len; ++i) {
			let buildNode = pickedNodes[i];
			if (!classMap.hasOwnProperty(buildNode.characterClass)) {
				classMap[buildNode.characterClass] = 0;
			}
			classMap[buildNode.characterClass]++;
		}

		// Get key of highest rated character class
		var highestClassId = Object.keys(classMap).reduce((a, b) => { return (classMap[a] > classMap[b]) ? a : b; });
		
		jQuery.get(WP_API_Settings.root + 'wp/v2/character-class/' + highestClassId, function(result) {
			this.setState({
				primaryCharacterClassName: result.title.rendered
			});
		}.bind(this));
	}

	/**
	 * Handle save button clicks
	 */
	saveBuild() {
		// Exit early if perk allocation is wrong
		if (this.state.perkPoints.current < 0) {
			this.setState({
				alert: {
					type: 'error',
					message: 'Trop de points d\'essence dépensés!'
				}
			});
			return;
		}

		this.setState({
			alert: {
				type: 'loading',
				message: 'Sauvegarde des compétences...'
			}
		});

		jQuery.ajax({
			url: WP_API_Settings.root + 'wp/v2/character/' + this.props.character.id,
			method: 'POST',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);
			},
			data: {
				'current_build': this.state.currentBuild
			},
			success: function() {
				this.setState({
					alert: {
						type: 'success',
						message: 'Compétences sauvegardées avec succès!'
					}
				});

				if (this.props.onSuccessfulSave) {
					this.props.onSuccessfulSave(this.state.currentBuild);
				}
			}.bind(this)
		});
	}
}

/**
 * @type {Object}
 */
CharacterBuilder.propTypes = {
	character: PropTypes.shape({
		id: PropTypes.number,
		title: PropTypes.shape({
			rendered: PropTypes.string
		}),
		people: PropTypes.shape({
			singular: PropTypes.string
		}),
		xp: PropTypes.shape({
			total: PropTypes.number
		}),
		perk_points: PropTypes.shape({
			bonus: PropTypes.number
		}),
		current_build: PropTypes.array,
		picked_starting_skill: PropTypes.number
	}),

	onSuccessfulSave: PropTypes.func
};
