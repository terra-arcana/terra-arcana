import React from 'react';

import SkillGraph from '../zodiac/skill-graph.jsx';
import SkillNodeInspector from '../zodiac/skill-node-inspector.jsx';
import PointNodeInspector from '../zodiac/point-node-inspector.jsx';
import CharacterSkillsPanel from './character-skills-panel.jsx';

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
		 * @type {Object}
		 * @private
		 */
		this.state = {
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			},
			pickedNodes: this.preparePickedNodesArray(props.character['current_build']),
			nodeData: [],
			linkData: [],
			alert: undefined
		};

		this.inspectSkill = this.inspectSkill.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.selectNode = this.selectNode.bind(this);
		this.preparePickedNodesArray = this.preparePickedNodesArray.bind(this);
		this.prepareBuildForSave = this.prepareBuildForSave.bind(this);
		this.saveBuild = this.saveBuild.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var inspector = <noscript />,
			alert = <noscript />;

		if (this.state.activeNode.id !== '') {
			switch(this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				inspector = (
					<SkillNodeInspector
						skill = {this.state.activeNode}
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
				<SkillGraph
					initialNodeData = {this.state.nodeData}
					initialLinkData = {this.state.linkData}
					pickedNodes = {this.state.pickedNodes}
					contiguousSelection = {true}
					onNodeMouseOver = {this.inspectSkill}
					onNodeMouseOut = {this.uninspect}
					onNodeSelect = {this.selectNode}
				/>

				{alert}

				<CharacterSkillsPanel
					characterName = {this.props.character.title.rendered}
					nodes = {this.state.pickedNodes}
					activeSkill = {this.state.activeNode}
					onSelectSkill = {this.inspectSkill}
					onUnselectSkill = {this.uninspect}
					onSaveClick = {this.saveBuild}
				/>

				{inspector}
			</div>
		);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'terraarcana/v1/graph-data', function(result) {
			this.setState({
				nodeData: result.nodes,
				linkData: result.links
			});
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
		var nodeIndex = this.state.pickedNodes.indexOf(id);

		if (nodeIndex === -1) {
			this.state.pickedNodes[this.state.pickedNodes.length] = id;
		} else {
			this.state.pickedNodes.splice(nodeIndex, 1);
		}

		this.setState({
			pickedNodes: this.state.pickedNodes
		});
	}

	/**
	 * Return the data of a particular node by ID
	 * @param {String} id The node ID
	 * @return {Object|null} The node data
	 */
	getNodeDataById(id) {
		var nodeData = null;

		this.state.nodeData.map(function(node) {
			if (node.id === id) {
				nodeData = node;
			}
		}.bind(this));

		return nodeData;
	}

	/**
	 * Convert the picked nodes array from the API to a pure JS array
	 * @param {Array} initial The initial Array
	 * @return {Array} The converted array
	 */
	preparePickedNodesArray(initial) {
		var final = [];

		// Exit early on an undefined array
		if (!Array.isArray(initial)) return [];

		for (var i = 0, len = initial.length; i < len; i++) {
			final.push(initial[i].id);
		}

		return final;
	}

	/**
	 * Convert the picked nodes state array to a format suitable for WP-API
	 * @return {Array} The prepared array
	 */
	prepareBuildForSave() {
		var preparedBuild = [];

		for (var i = 0, len = this.state.pickedNodes.length; i < len; i++) {
			preparedBuild.push({
				id: this.state.pickedNodes[i]
			});
		}

		return preparedBuild;
	}

	/**
	 * Handle save button clicks
	 */
	saveBuild() {
		var preparedBuild = this.prepareBuildForSave();

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
				'current_build': preparedBuild
			},
			success: function() {
				this.setState({
					alert: {
						type: 'success',
						message: 'Compétences sauvegardées avec succès!'
					}
				});

				if (this.props.onSuccessfulSave) {
					this.props.onSuccessfulSave(preparedBuild);
				}
			}.bind(this)
		});
	}
}

/**
 * @type {Object}
 */
CharacterBuilder.defaultProps = {
	character: {
		current_build: []
	}
};

/**
 * @type {Object}
 */
CharacterBuilder.propTypes = {
	character: React.PropTypes.shape({
		current_build: React.PropTypes.arrayOf(
			React.PropTypes.object.isRequired
		).isRequired
	}),

	onSuccessfulSave: React.PropTypes.func
};
