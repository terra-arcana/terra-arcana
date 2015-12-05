import React from 'react';
import ReactKonva from 'react-konva';

import Node from './node.jsx';
import SkillNode from './skill-node.jsx';
import NodeLink from './node-link.jsx';

require('../../styles/toile/toile.scss');

/**
 * Skill graph component
 *
 * @class
 */
export default class Toile extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @override
		 * @type {Object}
		 */
		this.state = {
			nodeData: this.props.initialNodeData,
			linkData: this.props.initialLinkData
		};

		this.onNodeClick = this.onNodeClick.bind(this);
		this.onNodeDragMove = this.onNodeDragMove.bind(this);
		this.draw = this.draw.bind(this);
	}

	/**
	 * Converts a string like "14px" to a number
	 *
	 * @param {String} str The string to convert
	 * @return {Number} The number
	 */
	static pxStringToNumber(str) {
		return parseInt(str.substring(0, str.length - 2));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
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
										selected = {(this.props.pickedNodes.indexOf(node.id) !== -1)}
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
										selected = {(this.props.pickedNodes.indexOf(node.id) !== -1)}
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
	}

	/** 
	 * @override
	 */
	componentWillMount() {
		/**
		 * Maximum height for the graph
		 * @type {Number}
		 */
		this.MAX_HEIGHT = 600;

		/** 
		 * Height of the WordPress menu bar
		 * @type {Number}
		 */
		this.WP_BAR_HEIGHT = 32;
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var root = React.findDOMNode(this);

		/**
		 * Canvas DOM elements
		 * @type {Array<HTMLElement>}
		 */
		this.canvas = root.getElementsByTagName('canvas');

		window.addEventListener('resize', this.draw);
		this.stage.node.on('dragmove', this.draw);

		this.draw();
	}

	/**
	 * Redraw the canvas and its contents
	 */
	draw() {
		this.resizeCanvas();
		this.stage.node.draw();
	}

	/**
 	 * Resizes the editor canvas to its wrapper width
 	 */
	resizeCanvas() {
		var editorSize = this.getEditorSize();

		for (var i = 0; i < this.canvas.length; i++) {
			this.canvas[i].width = editorSize.w;
			this.canvas[i].height = editorSize.h;
		}
	}

	/**
	 * Get the desired size of the editor canvas
	 *
	 * @return {Object} The desired width and height of the editor canvas
	 */
	getEditorSize() {
		var root = React.findDOMNode(this),
			editorStyle = window.getComputedStyle(root),
			paddings = {
				left: Toile.pxStringToNumber(editorStyle.paddingLeft),
				right: Toile.pxStringToNumber(editorStyle.paddingRight)
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
	}

	/**
	 * Return the data of a particular node by ID
	 *
	 * @param {number} id The node ID
	 * @return {Node|null} The node
	 */
	getNodeDataById(id) {
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
	getLinkedNodesById(id) {
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
	onNodeClick(id) {
		// TODO: Check to see if we can pick this node before applying this
		if (this.props.onSelectNode) {
			this.props.onSelectNode(id);
		}
	}

	/**
	 * Handle node drags
	 *
	 * @param {number} id The node ID
	 * @param {number} x The new X coordinate
	 * @param {number} y The new Y coordinate
	 */
	onNodeDragMove(id, x, y) {
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
}

/**
 * Default props
 * 
 * @type {Object}
 */
Toile.defaultProps = {
	initialNodeData: [],
	initialLinkData: [],
	activeNode: 0,
	pickedNodes: []
};
