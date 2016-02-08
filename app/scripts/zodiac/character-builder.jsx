import React from 'react';

import SkillGraph from './skill-graph.jsx';
import SkillNodeInspector from './skill-node-inspector.jsx';
import PointNodeInspector from './point-node-inspector.jsx';
import CharacterSkillsPanel from './character-skills-panel.jsx';

/**
 * A CharacterBuilder allows editing of a character build by displaying a {@link SkillGraph} that 
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
			pickedNodes: this.props.initialPickedNodes,
			nodeData: props.initialNodeData,
			linkData: props.initialLinkData
		};

		this.inspectSkill = this.inspectSkill.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.selectNode = this.selectNode.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var inspector = null;
		if (this.state.activeNode.id !== '') {
			switch(this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				inspector = (
					<SkillNodeInspector
						skill = {this.state.activeNode}
					></SkillNodeInspector>
				);
				break;
			case 'perk':
			case 'life':
				inspector = (
					<PointNodeInspector
						pointNode = {this.getNodeDataById(this.state.activeNode.id)}
					></PointNodeInspector>
				);
			}
		}

		return (
			<div className='row'>
				<SkillGraph
					initialNodeData = {this.state.nodeData}
					initialLinkData = {this.state.linkData}
					pickedNodes = {this.state.pickedNodes} 
					startNode = {this.props.startNode}
					contiguousSelection = {true}
					onNodeMouseOver = {this.inspectSkill}
					onNodeMouseOut = {this.uninspect}
					onNodeSelect = {this.selectNode}
				></SkillGraph>
				<CharacterSkillsPanel
					nodes = {this.state.pickedNodes}
					activeSkill = {this.state.activeNode}
					onSelectSkill = {this.inspectSkill}
					onUnselectSkill = {this.uninspect}
				></CharacterSkillsPanel>
				
				{inspector}
			</div>
		);	
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get('http://' + location.hostname + '/wp-json/terraarcana/v1/graph-data', function(result) {
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
}

/**
 * @type {Object}
 */
CharacterBuilder.defaultProps = {
	initialNodeData: [
		{
			id: '1',
			type: 'normal',
			x: 300,
			y: 200
		},
		{
			id: '2',
			type: 'normal',
			x: 350,
			y: 400
		},
		{
			id: '3',
			type: 'skill',
			x: 400,
			y: 100
		},
		{
			id: '4',
			type: 'skill',
			x: 500,
			y: 400
		},
		{
			id: '4-1',
			type: 'upgrade',
			x: 500,
			y: 200
		},
		{
			id: '4-2',
			type: 'upgrade',
			x: 550,
			y: 200
		}
	],
	initialLinkData: [
		['1', '2'],
		['2', '3'],
		['1', '3'],
		['2', '4'],
		['4', '4-1'],
		['4', '4-2']
	],
	initialPickedNodes: [],
	startNode: '1'
};

/**
 * @type {Object}
 */
CharacterBuilder.propTypes = {
	initialNodeData: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			type: React.PropTypes.string.isRequired,
			x: React.PropTypes.number.isRequired,
			y: React.PropTypes.number.isRequired
		})
	).isRequired,
	initialLinkData: React.PropTypes.arrayOf(
		React.PropTypes.arrayOf(
			React.PropTypes.string.isRequired
		)
	).isRequired,
	initialPickedNodes: React.PropTypes.array,
	startNode: React.PropTypes.string
};
