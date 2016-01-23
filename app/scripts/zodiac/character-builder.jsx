import React from 'react';

import SkillGraph from './skill-graph.jsx';
import SkillTooltip from './skill-tooltip.jsx';
import CharacterSkillsPanel from './character-skills-panel.jsx';

/**
 * Character builder component
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
			activeSkill: {
				id: '',
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
		var skillTooltip = null;
		if (this.state.activeSkill.id !== '') {
			skillTooltip = (
				<SkillTooltip
					skill = {this.state.activeSkill}
				></SkillTooltip>
			);
		}

		return (
			<div className='row'>
				<SkillGraph
					initialNodeData = {this.state.nodeData}
					initialLinkData = {this.state.linkData}
					pickedNodes = {this.state.pickedNodes} 
					startNode = {this.props.startNode}
					contiguousSelection = 'true'
					onNodeMouseOver = {this.inspectSkill}
					onNodeMouseOut = {this.uninspect}
					onNodeSelect = {this.selectNode}
				></SkillGraph>
				<CharacterSkillsPanel
					nodes = {this.state.pickedNodes}
					activeSkill = {this.state.activeSkill}
					onSelectSkill = {this.inspectSkill}
					onUnselectSkill = {this.uninspect}
				></CharacterSkillsPanel>
				
				{skillTooltip}
			</div>
		);	
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(appLocals.api.terra + 'skill/graph-data', function(result) {
			this.setState({
				nodeData: result.nodes,
				linkData: result.links
			});
		}.bind(this));
	}

	/**
	 * Inspect a skill and reveal its details
	 * @param {Object} skill The skill object, containing an `id` string and an `upgrades` array of string ids
	 */
	inspectSkill(skill) {
		this.setState({
			activeSkill: skill
		});
	}

	/**
	 * Stop inspecting skills
	 */
	uninspect() {
		this.setState({
			activeSkill: {
				id: '',
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
}

/**
 * Default props
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
