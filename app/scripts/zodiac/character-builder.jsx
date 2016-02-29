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
			<div className='row'>
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
	initialPickedNodes: []
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
	initialPickedNodes: React.PropTypes.arrayOf(
		React.PropTypes.string.isRequired
	)
};
