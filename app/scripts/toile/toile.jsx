import React from 'react';
import ReactKonva from 'react-konva';

import Node from './node.jsx';
import SkillNode from './skill-node.jsx';
import UpgradeNode from './upgrade-node.jsx';
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
										selected = {(this.props.startNode === node.id || this.props.pickedNodes.indexOf(node.id) !== -1)}
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
										selected = {(this.props.startNode === node.id || this.props.pickedNodes.indexOf(node.id) !== -1)}
										onClick = {this.onNodeClick}
										onDragMove = {this.onNodeDragMove}
										onMouseOver = {this.props.onNodeMouseOver}
										onMouseOut = {this.props.onNodeMouseOut}
									></SkillNode>
								);
							}

							// Upgrade nodes
							else if (node.type === 'upgrade') {
								return (
									<UpgradeNode
										ref = {(ref) => this.nodes[node.id] = ref}
										id = {node.id}
										x = {node.x}
										y = {node.y}
										selected = {(this.props.pickedNodes.indexOf(node.id) !== -1)}
										onClick = {this.onNodeClick}
										onDragMove = {this.onNodeDragMove}
										onMouseOver = {this.props.onNodeMouseOver}
										onMouseOut = {this.props.onNodeMouseOut}
									></UpgradeNode>
								);
							}

							return null;
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
	 * @param {String} id The node ID
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
	 * @param {String} id The node ID
	 * @return {Array<String>} The linked node IDs
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
	 * Determines whether or not a node can be picked
	 * 
	 * @param {String} id The node ID
	 * @return {Boolean} This node is pickable
	 */
	isNodePickable(id) {
		var siblings = this.getLinkedNodesById(id);

		// Check siblings for a picked node
		for (var i = 0; i < siblings.length; i++) {
			if (this.props.pickedNodes.indexOf(siblings[i]) !== -1 || this.props.startNode === siblings[i]) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determines whether or not a node can be unpicked without leaving 
	 * orphan nodes
	 * 
	 * @param {String} id The node ID
	 * @return {Boolean} This node is unpickable
	 */
	isNodeUnpickable(id) {
		var nodeData = this.getNodeDataById(id),
			siblings = this.getLinkedNodesById(id);

		if (nodeData && nodeData.locked) {
			return false;
		}

		// Check for orphan nodes. If at least one is found, the node is unpickable
		for (var i = 0; i < siblings.length; i++) {
			// Skip unpicked siblings
			if (this.props.pickedNodes.indexOf(siblings[i]) === -1) {
				continue;
			}

			if (!this.hasAlternatePathToStart(siblings[i], id)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Checks to see if a source node is connected to the start node without 
	 * passing by specific nodes. If there is no start node yet, this will 
	 * always return false.
	 * 
	 * @param  {String} source The starting node
	 * @param  {Array<String>} without The nodes to exclude in the search
	 * @return {Boolean} The node has an alternate path to start
	 */
	hasAlternatePathToStart(source, without) {
		var seen = [source],
			path = [source],
			cursor, siblings;

		// Early exit if there is no start node
		if (this.props.startNode === 0) {
			return false;
		}

		// Consolidate single values in without to an array
		if (!Array.isArray(without)) {
			without = [without];
		} 

		while(path.length > 0) {
			cursor = path.pop();

			// We exit as soon as we find the cursor
			if (cursor === this.props.startNode) {
				return true;
			}

			siblings = this.getLinkedNodesById(cursor);
			for (var i = 0; i < siblings.length; i++) {
				// Exclude non-picked nodes and nodes in without from the search
				// NOTE: Start node is never considered picked, so we have to make sure we aren't excluding it here
				if (this.props.startNode !== siblings[i] && 
					(this.props.pickedNodes.indexOf(siblings[i]) === -1 || without.indexOf(siblings[i]) !== -1)) {
					continue;
				}

				// Push all unvisited siblings into the queue
				if (seen.indexOf(siblings[i]) === -1) {
					seen.push(siblings[i]);
					path.push(siblings[i]);
				}
			}
		}

		// All connected nodes have been scanned without finding the start node
		return false;
	}

	/**
	 * Handle node clicks
	 * 
	 * @param {String} id The node ID
	 */
	onNodeClick(id) {
		var isPicked = (this.props.pickedNodes.indexOf(id) !== -1),
			canBeToggled = ((!isPicked && this.isNodePickable(id)) ||
							(isPicked && this.isNodeUnpickable(id)));
	
		// Only go through click processing if node can be toggled
		if (canBeToggled && this.props.onSelectNode) {
			this.props.onSelectNode(id);
		}
	}

	/**
	 * Handle node drags
	 *
	 * @param {String} id The node ID
	 * @param {Number} x The new X coordinate
	 * @param {Number} y The new Y coordinate
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
	pickedNodes: [],
	startNode: ''
};
