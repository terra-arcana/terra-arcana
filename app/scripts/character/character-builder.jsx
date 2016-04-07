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
			linkData: []
		};

		this.inspectSkill = this.inspectSkill.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.selectNode = this.selectNode.bind(this);
		this.preparePickedNodesArray = this.preparePickedNodesArray.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var inspector = <noscript />;

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
				<CharacterSkillsPanel
					characterName = {this.props.character.title.rendered}
					nodes = {this.state.pickedNodes}
					activeSkill = {this.state.activeNode}
					onSelectSkill = {this.inspectSkill}
					onUnselectSkill = {this.uninspect}
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
	 * @param {String} id The picked node id
	 */
	inspectSkill(id) {
		var nodeData = this.getNodeDataById(id),
			splitID = id.split('-'),
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
		if (!Array.isArray(initial)) {
			return [];
		}

		for (var i = 0; i < initial.length; i++) {
			final.push(initial[i].id);
		}

		return final;
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
	})
};
