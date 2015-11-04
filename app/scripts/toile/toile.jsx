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
		MAX_HEIGHT: 600,
		WP_BAR_HEIGHT: 32,
		nodes: [
			{
				id: 1,
				x: 300,
				y: 200
			},
			{
				id: 2,
				x: 350,
				y: 400
			}
		],
		skillNodes: [
			{
				id: 3,
				x: 400,
				y: 100
			}
		]
	};
};

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
		<div className="toile-editor">
			<ReactKonva.Stage width={2000} height={2000} ref={(ref) => this.stage = ref} draggable="true">
				<ReactKonva.Layer ref={(ref) => this.linkLayer = ref}>
					<NodeLink />
					<NodeLink x={200} y={300} />
				</ReactKonva.Layer>
				<ReactKonva.Layer ref={(ref) => this.nodeLayer = ref}>
					{this.props.nodes.map(function(node) {
					   return (
						   <Node
							   id = {node.id}
							   x = {node.x}
							   y = {node.y}
							   onClick = {this.onNodeClick}
							   onDragMove = {this.onNodeDragMove}
						   ></Node>
				   		);
					}.bind(this))}
					{this.props.skillNodes.map(function(node) {
						return (
							<SkillNode
								id = {node.id}
								x = {node.x}
								y = {node.y}
								onClick = {this.onNodeClick}
								onDragMove = {this.onNodeDragMove}
							></SkillNode>
						);
					}.bind(this))}
				</ReactKonva.Layer>
			</ReactKonva.Stage>
			<div ref="tooltip" id="toile-editor-tooltip" className="toile-editor-tooltip"/>
		</div>
	);
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
	var	editorSize = this.getEditorSize(),
		root = React.findDOMNode(this);

	root.setAttribute('style', 'width: ' + editorSize.w + 'px; height: ' + editorSize.h + 'px;');

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
	var	root = React.findDOMNode(this),
	 	editorStyle = window.getComputedStyle(root),
		parentStyle = window.getComputedStyle(root.parentNode),
		margins = {
			left: pxStringToNumber(editorStyle.marginLeft),
			right: pxStringToNumber(editorStyle.marginRight),
			top: pxStringToNumber(editorStyle.marginTop),
			bottom: pxStringToNumber(editorStyle.marginBottom)
		},
		parentPaddings = {
			left: pxStringToNumber(parentStyle.paddingLeft),
			right: pxStringToNumber(parentStyle.paddingRight)
		},
		width, height;

	// Calculate width by taking into account paddings and margins
	width = root.parentNode.offsetWidth - margins.left - margins.right - parentPaddings.left - parentPaddings.right;
	height = Math.min(
		width * 0.75,
		window.innerHeight - margins.top - margins.bottom - this.props.WP_BAR_HEIGHT,
		this.props.MAX_HEIGHT
	);

	return {
		w: width,
		h: height
	};
};

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
 */
toile.onNodeDragMove = function(id) {
	console.log('dragged node ' + id);
}

/* Export */

export default React.createClass(toile);
