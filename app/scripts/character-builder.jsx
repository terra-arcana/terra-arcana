import React from 'react';

import Toile from './toile/toile.jsx';
import DetailsPanel from './toile/details-panel.jsx';

var characterBuilder = {};

/* Methods */

/**
 * Set default props
 *
 * @return {Object} The default props
 */
characterBuilder.getDefaultProps = function() {
	return {
		nodeData: [
			{
				id: 1,
				type: 'normal',
				x: 300,
				y: 200
			},
			{
				id: 2,
				type: 'normal',
				x: 350,
				y: 400
			},
			{
				id: 3,
				type: 'skill',
				x: 400,
				y: 100
			}
		],
		linkData: [
			[1, 2],
			[2, 3],
			[1, 3]
		]
	};
};

/**
 * Set the initial state
 *
 * @return {Object} The initial state
 */
characterBuilder.getInitialState = function() {
	return {
		activeNode: 0,
		pickedNodes: []
	};
};

/**
 * Render the character builder
 * 
 * @return {jsx} The component template
 */
characterBuilder.render = function() {
	return (
		<div className="row">
			<Toile
				initialNodeData = {this.props.nodeData}
				initialLinkData = {this.props.linkData}
				activeNode = {this.state.activeNode}
				pickedNodes = {this.state.pickedNodes} 
				onNodeMouseOver = {this.inspectNode}
				onNodeMouseOut = {this.uninspect}
			></Toile>
			<DetailsPanel
				id = {this.state.activeNode}
			></DetailsPanel>
		</div>
	);	
};

/**
 * Inspect a node and reveal its details
 *
 * @param {number} id The node ID
 */
characterBuilder.inspectNode = function(id) {
	this.setState({
		activeNode: id
	});
};

/**
 * Stop inspecting nodes
 */
characterBuilder.uninspect = function() {
	this.setState({
		activeNode: 0
	});
};

/* Export */

export default React.createClass(characterBuilder);
