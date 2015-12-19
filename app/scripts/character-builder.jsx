import React from 'react';

import Toile from './toile/toile.jsx';
import DetailsPanel from './toile/details-panel.jsx';

/**
 * Character builder component
 *
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
			activeNode: '',
			pickedNodes: this.props.initialPickedNodes
		};

		this.inspectNode = this.inspectNode.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.selectNode = this.selectNode.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="row">
				<Toile
					initialNodeData = {this.props.nodeData}
					initialLinkData = {this.props.linkData}
					pickedNodes = {this.state.pickedNodes} 
					startNode = {this.props.startNode}
					activeNode = {this.state.activeNode}
					onNodeMouseOver = {this.inspectNode}
					onNodeMouseOut = {this.uninspect}
					onSelectNode = {this.selectNode}
				></Toile>
				<DetailsPanel
					id = {this.state.activeNode}
				></DetailsPanel>
			</div>
		);	
	}

	/**
	 * Inspect a node and reveal its details
	 *
	 * @param {String} id The node ID
	 */
	inspectNode(id) {
		this.setState({
			activeNode: id
		});
	}

	/**
	 * Stop inspecting nodes
	 */
	uninspect() {
		this.setState({
			activeNode: ''
		});
	}

	/**
	 * Select a node
	 *
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
 * 
 * @type {Object}
 */
CharacterBuilder.defaultProps = {
	nodeData: [
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
		}
	],
	linkData: [
		['1', '2'],
		['2', '3'],
		['1', '3'],
		['2', '4'],
		['4', '4-1']
	],
	initialPickedNodes: [],
	startNode: '1'
};
