import React from 'react';
import ReactKonva from 'react-konva';
import Konva from 'konva';

import Node from './node.jsx';
import SkillNode from './skill-node.jsx';
import NodeLink from './node-link.jsx';

require('../../styles/toile/toile.scss');

var toile = {};

/* Static methods */

/**
 * Converts a string like "14px" to a number
 *
 * @param {string} str The string to convert
 * @return {number} The number
 */
var pxStringToNumber = function(str) {
	return parseInt(str.substring(0, str.length - 2));
};

/* Methods */

/**
 * Set initial props
 *
 * @return {Object} The default props
 */
toile.getDefaultProps = function() {
	return {
		initialNodeData: [],
		initialLinkData: [],
		activeNode: 0,
		pickedNodes: []
	};
};

/**
 * Get the initial state
 * 
 * @return {Object} The initial state
 */
toile.getInitialState = function() {
	return {
		nodeData: this.props.initialNodeData,
		linkData: this.props.initialLinkData
	}
}

/**
 * Render the editor component
 *
 * @return {jsx} The component template
 */
toile.render = function() {
	// HACK: Width and height have to be set in stage definition, otherwise
	// event detection will not work. As far as we know it needs to be at least
	// the same size as the actual rendering of the stage after resizing, so
	// putting big values seems to work as intended.
	return (
		<div className="toile-editor col-lg-8 col-sm-12">
			<ReactKonva.Stage width={2000} height={2000} ref={(ref) => this.stage = ref} draggable="true">
				<ReactKonva.Layer ref={(ref) => this.linkLayer = ref}>
					{this.state.linkData.map(function(link) {
						var fromNode = this.getNodeDataById(link[0]);
						var toNode = this.getNodeDataById(link[1]);
						return (
							<NodeLink
								key = {[link[0], link[1]].join('-')}
								from = {{x: fromNode.x, y: fromNode.y}}
								to = {{x: toNode.x, y: toNode.y}}
							></NodeLink>
						);
					}.bind(this))}
				</ReactKonva.Layer>
				<ReactKonva.Layer ref={(ref) => this.nodeLayer = ref}>
					{this.state.nodeData.map(function(node) {
						// Normal nodes
						if (node.type === 'normal') {
							return (
								<Node
									ref = {(ref) => this.nodes[node.id] = ref}
									id = {node.id}
									x = {node.x}
									y = {node.y}
									onClick = {this.onNodeClick}
									onDragMove = {this.onNodeDragMove}
									onMouseOver = {this.props.onNodeMouseOver}
									onMouseOut = {this.props.onNodeMouseOut}
								></Node>
							);
						}

						// Skill nodes
						else if (node.type === 'skill') {
							return (
								<SkillNode
									ref = {(ref) => this.nodes[node.id] = ref}
									id = {node.id}
									x = {node.x}
									y = {node.y}
									onClick = {this.onNodeClick}
									onDragMove = {this.onNodeDragMove}
									onMouseOver = {this.props.onNodeMouseOver}
									onMouseOut = {this.props.onNodeMouseOut}
								></SkillNode>
							);
						}
					}.bind(this))}
				</ReactKonva.Layer>
			</ReactKonva.Stage>
		</div>
	);
};

/**
 * Prepare the component before mounting
 */
toile.componentWillMount = function() {
	this.MAX_HEIGHT = 600;
	this.WP_BAR_HEIGHT = 32;
};

/**
 * Initialize the component after mounting
 */
toile.componentDidMount = function() {
	var root = React.findDOMNode(this);

	this.canvas = root.getElementsByTagName('canvas');

	window.addEventListener('resize', this.draw);
	this.stage.node.on('dragmove', this.draw);

	this.draw();
};

/**
 * Redraw the canvas and its contents
 */
toile.draw = function() {
	this.resizeCanvas();
	this.stage.node.draw();
};

/**
 * Resizes the editor canvas to its wrapper width
 */
toile.resizeCanvas = function() {
	var root = React.findDOMNode(this), 
		editorSize;

	//root.setAttribute('style', 'width: ' + 0 + 'px; height: ' + 0 + 'px;');

	editorSize = this.getEditorSize();

	//root.setAttribute('style', 'width: ' + editorSize.w + 'px; height: ' + editorSize.h + 'px;');

	for (var i = 0; i < this.canvas.length; i++) {
		this.canvas[i].width = editorSize.w;
		this.canvas[i].height = editorSize.h;
	}
};

/**
 * Get the desired size of the editor canvas
 *
 * @return {Object} The desired width and height of the editor canvas
 */
 toile.getEditorSize = function() {
	var root = React.findDOMNode(this),
	 	editorStyle = window.getComputedStyle(root),
		parentStyle = window.getComputedStyle(root.parentNode.parentNode),
		paddings = {
			left: pxStringToNumber(editorStyle.paddingLeft),
			right: pxStringToNumber(editorStyle.paddingRight)
		},
		width, height;

	// Calculate width by taking into account paddings and margins
	width = root.offsetWidth - paddings.left - paddings.right;
	height = Math.min(
		width * 0.75,
		window.innerHeight - this.WP_BAR_HEIGHT,
		this.MAX_HEIGHT
	);

	return {
		w: width,
		h: height
	};
};

/**
 * Return the data of a particular node by ID
 *
 * @param {number} id The node ID
 * @return {Node|null} The node
 */
toile.getNodeDataById = function(id) {
	var returnNode = null;

	this.state.nodeData.map(function(node) {
		if (node.id === id) {
			returnNode = node;
		}
	}.bind(this));

	return returnNode;
}

/**
 * Return all nodes linked to a particular node
 *
 * @param {number} id The node ID
 * @return {Array<number>} The linked node IDs
 */
toile.getLinkedNodesById = function(id) {
	var linkedNodes = [];

	this.state.linkData.map(function(link) {
		if (link[0] === id) {
			linkedNodes[linkedNodes.length] = link[1];
		} else if (link[1] === id) {
			linkedNodes[linkedNodes.length] = link[0];
		}
	}.bind(this));

	return linkedNodes;
}

/**
 * Handle node clicks
 * 
 * @param {number} id The node ID
 */
toile.onNodeClick = function(id) {
	console.log('clicked node ' + id);
}

/**
 * Handle node drags
 *
 * @param {number} id The node ID
 * @param {number} x The new X coordinate
 * @param {number} y The new Y coordinate
 */
toile.onNodeDragMove = function(id, x, y) {
	var linkedNodes = this.getLinkedNodesById(id),
		newNodeData = jQuery.extend([], this.state.nodeData),
		i, j;

	for (i = 0; i < linkedNodes.length; i++) {
		for (j = 0; j < newNodeData.length; j++) {
			if (newNodeData[j].id === id) {
				newNodeData[j].x = x;
				newNodeData[j].y = y;
			}
		}
	}

	this.setState({
		nodeData: newNodeData
	});
}

/* Export */

export default React.createClass(toile);
