import React from 'react';
import ReactDOM from 'react-dom';
import {Stage, Layer} from 'react-konva';
import Lodash from 'lodash';

import SkillNode from './skill-node.jsx';
import UpgradeNode from './upgrade-node.jsx';
import PointNode from './point-node.jsx';
import NodeLink from './node-link.jsx';

require('../../styles/zodiac/skill-graph.scss');

/**
 * A SkillGraph component renders a Konva stage in which {@link Node} and {@link NodeLink}
 * components are rendered to form a graph.
 * @class
 */
export default class SkillGraph extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		this.ZOOM_SPEED = 0.001;
		this.ZOOM_MIN = 0.1;
		this.ZOOM_MAX = 1.5;

		/**
		 * @override
		 * @type {Object}
		 */
		this.state = {
			nodeData: this.props.initialNodeData,
			linkData: this.props.initialLinkData,
			zoom: 1
		};

		/**
		 * References to all the {@link Node} elements of the graph
		 * @type {Array}
		 * @private
		 */
		this.nodes = [];

		this.draw = this.draw.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.getEditorSize = this.getEditorSize.bind(this);
		this.getNodeDataById = this.getNodeDataById.bind(this);
		this.getLinkedNodesById = this.getLinkedNodesById.bind(this);
		this.getStartNodes = this.getStartNodes.bind(this);
		this.isNodePickable = this.isNodePickable.bind(this);
		this.isNodeUnpickable = this.isNodeUnpickable.bind(this);
		this.hasAlternatePathToStart = this.hasAlternatePathToStart.bind(this);
		this.onNodeClick = this.onNodeClick.bind(this);
		this.onNodeDragMove = this.onNodeDragMove.bind(this);
		this.onZoom = this.onZoom.bind(this);
		this.onResetZoom = this.onResetZoom.bind(this);
		this.getNodeData = this.getNodeData.bind(this);
		this.getLinkData = this.getLinkData.bind(this);
	}

	/**
	 * Converts a string like "14px" to a number
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
			<div
				className = "ta-skill-graph-editor"
				onWheel = {this.onZoom}
			>
				<button
					type = "button"
					className = "ta-reset-zoom-button btn btn-default pull-right"
					onClick = {this.onResetZoom}
				>
					Restaurer zoom
				</button>
				<Stage
					ref = {(ref) => this.stage = ref}
					width = {2000}
					height = {2000}
				>
					<Layer
						ref = {(ref) => this.linkLayer = ref}
						scale = {{x: this.state.zoom, y: this.state.zoom}}
					>
						{this.state.linkData.map(function(link) {
							var fromNode = this.getNodeDataById(link[0]),
								toNode = this.getNodeDataById(link[1]),
								highlighted = false;

							for (var i = 0; i < this.props.highlightedLinks.length; i++) {
								if ((this.props.highlightedLinks[i][0] === link[0] && this.props.highlightedLinks[i][1] === link[1]) ||
									(this.props.highlightedLinks[i][0] === link[1] && this.props.highlightedLinks[i][1] === link[0])) {
									highlighted = true;
									break;
								}
							}

							return (
								<NodeLink
									key = {link.join('-')}
									from = {{x: fromNode.x, y: fromNode.y}}
									to = {{x: toNode.x, y: toNode.y}}
									highlighted = {highlighted}
								/>
							);
						}.bind(this))}
					</Layer>
					<Layer
						ref = {(ref) => this.nodeLayer = ref}
						scale = {{x: this.state.zoom, y: this.state.zoom}}
					>
						{this.state.nodeData.map(function(node) {
							var state;

							if (this.props.pickedNodes.indexOf(node.id) !== -1) {
								state = 'picked';
							} else if (node.start) {
								state = 'start';
							} else {
								state = 'normal';
							}

							switch (node.type) {

							// Skill nodes
							case 'skill':
								return (
									<SkillNode
										key = {node.id}
										ref = {(ref) => this.nodes[node.id] = ref}
										id = {node.id}
										x = {node.x}
										y = {node.y}
										selected = {(node.start || this.props.pickedNodes.indexOf(node.id) !== -1)}
										state = {state}
										draggable = {this.props.canDragNodes}
										onClick = {this.onNodeClick}
										onDragMove = {this.onNodeDragMove}
										onMouseOver = {this.props.onNodeMouseOver}
										onMouseOut = {this.props.onNodeMouseOut}
									/>
								);

							// Upgrade nodes
							case 'upgrade':
								return (
									<UpgradeNode
										key = {node.id}
										ref = {(ref) => this.nodes[node.id] = ref}
										id = {node.id}
										x = {node.x}
										y = {node.y}
										selected = {(this.props.pickedNodes.indexOf(node.id) !== -1)}
										state = {state}
										draggable = {this.props.canDragNodes}
										onClick = {this.onNodeClick}
										onDragMove = {this.onNodeDragMove}
										onMouseOver = {this.props.onNodeMouseOver}
										onMouseOut = {this.props.onNodeMouseOut}
									/>
								);

							// Point nodes
							case 'perk':
							case 'life':
								return (
									<PointNode
										key = {node.id}
										ref = {(ref) => this.nodes[node.id] = ref}
										id = {node.id}
										x = {node.x}
										y = {node.y}
										type = {node.type}
										value = {node.value}
										selected = {(node.start || this.props.pickedNodes.indexOf(node.id) !== -1)}
										state = {state}
										draggable = {(this.props.canDragNodes)}
										onClick = {this.onNodeClick}
										onDragMove = {this.onNodeDragMove}
										onMouseOver = {this.props.onNodeMouseOver}
										onMouseOut = {this.props.onNodeMouseOut}
									/>
								);

							default:
								return <noscript />;
							}
						}.bind(this))}
					</Layer>
				</Stage>
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
		var root = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

		/**
		 * Canvas DOM elements
		 * @type {Array<HTMLElement>}
		 */
		this.canvas = root.getElementsByTagName('canvas');

		this.stage.node.draggable(true);

		window.addEventListener('resize', this.draw);
		this.stage.node.on('dragmove', this.draw);

		this.draw();
	}

	/**
	 * @override
	 * @param {Object} props New props
	 */
	componentWillReceiveProps(props) {
		this.setState({
			nodeData: props.initialNodeData,
			linkData: props.initialLinkData
		});
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
	 * @return {Object} The desired width and height of the editor canvas
	 */
	getEditorSize() {
		var root = ReactDOM.findDOMNode(this), // eslint-disable-line react/no-find-dom-node
			editorStyle = window.getComputedStyle(root),
			paddings = {
				left: SkillGraph.pxStringToNumber(editorStyle.paddingLeft),
				right: SkillGraph.pxStringToNumber(editorStyle.paddingRight)
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
	 * Get all nodes that has the start attribute
	 * @return {Array<String>} The IDs of all start nodes
	 */
	getStartNodes() {
		var startNodes = [];

		this.state.nodeData.map(function(node) {
			if (node.start) {
				startNodes.push(node.id);
			}
		});

		return startNodes;
	}

	/**
	 * Determines whether or not a node can be picked
	 * @param {String} id The node ID
	 * @return {Boolean} This node is pickable
	 */
	isNodePickable(id) {
		var siblings = this.getLinkedNodesById(id);

		// Check siblings for a picked node
		for (var i = 0; i < siblings.length; i++) {
			var siblingData = this.getNodeDataById(siblings[i]);

			if (this.props.pickedNodes.indexOf(siblings[i]) !== -1 || !!siblingData.start ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determines whether or not a node can be unpicked without leaving
	 * orphan nodes
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
	 * @param  {String} source The starting node
	 * @param  {Array<String>} without The nodes to exclude in the search
	 * @return {Boolean} The node has an alternate path to start
	 */
	hasAlternatePathToStart(source, without) {
		var seen = [source],
			path = [source],
			cursor, cursorData,
			siblings, siblingData;

		// Early exit if there is no start node
		if (this.getStartNodes().length === 0) {
			return false;
		}

		// Consolidate single values in without to an array
		if (!Array.isArray(without)) {
			without = [without];
		}

		while(path.length > 0) {
			cursor = path.pop();
			cursorData = this.getNodeDataById(cursor);

			// If we find a start node, we exit immediately
			if (cursorData.start) {
				return true;
			}

			siblings = this.getLinkedNodesById(cursor);
			for (var i = 0; i < siblings.length; i++) {
				siblingData = this.getNodeDataById(siblings[i]);

				// Exclude non-picked nodes and nodes in without from the search
				// NOTE: Start node is never considered picked, so we have to make sure we aren't excluding it here
				if (!siblingData.start &&
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
	 * @param {String} id The node ID
	 */
	onNodeClick(id) {
		var isPicked = (this.props.pickedNodes.indexOf(id) !== -1),
			canBeToggled = ((!isPicked && this.isNodePickable(id)) ||
							(isPicked && this.isNodeUnpickable(id)));

		// Only go through click processing if node can be toggled or if
		// contiguous selection is disabled
		if (!(this.props.contiguousSelection) || (canBeToggled && this.props.onNodeSelect)) {
			this.props.onNodeSelect(id);
		}
	}

	/**
	 * Handle node drags
	 * @param {String} id The node ID
	 * @param {Number} x The new X coordinate
	 * @param {Number} y The new Y coordinate
	 */
	onNodeDragMove(id, x, y) {
		var i, newNodeData = Lodash.cloneDeep(this.state.nodeData);

		for (i = 0; i < newNodeData.length; i++) {
			if (newNodeData[i].id === id) {
				newNodeData[i].x = x;
				newNodeData[i].y = y;
			}
		}

		this.setState({
			nodeData: newNodeData
		});
	}

	/**
	 * Handle mouse wheel events to apply zoom on the graph
	 * @param {SyntheticMouseEvent} event The mouse event
	 */
	onZoom(event) {
		event.preventDefault();

		this.setState({
			zoom: Math.max(this.ZOOM_MIN, Math.min(this.ZOOM_MAX, this.state.zoom + event.deltaY*this.ZOOM_SPEED))
		});
	}

	/**
	 * Handle zoom reset button clicks
	 * @param {SyntheticMouseEvent} event The click event
	 */
	onResetZoom(event) {
		event.preventDefault();

		this.setState({
			zoom: 1
		});
	}

	/**
	 * Get current graph node data
	 * @return {Object}
	 */
	getNodeData() {
		return Lodash.cloneDeep(this.state.nodeData);
	}

	/**
	 * Get current graph link data
	 * @return {Object}
	 */
	getLinkData() {
		return Lodash.cloneDeep(this.state.linkData);
	}
}

/**
 * @type {Object}
 */
SkillGraph.defaultProps = {
	initialNodeData: [],
	initialLinkData: [],
	pickedNodes: [],
	contiguousSelection: true,
	canDragNodes: false,
	highlightedLinks: []
};

/**
 * @type {Object}
 */
SkillGraph.propTypes = {
	initialNodeData: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			type: React.PropTypes.string.isRequired,
			x: React.PropTypes.number.isRequired,
			y: React.PropTypes.number.isRequired,
			start: React.PropTypes.bool,
			value: React.PropTypes.string
		})
	).isRequired,
	initialLinkData: React.PropTypes.arrayOf(
		React.PropTypes.arrayOf(
			React.PropTypes.string.isRequired
		)
	).isRequired,
	pickedNodes: React.PropTypes.arrayOf(
		React.PropTypes.string
	),
	contiguousSelection: React.PropTypes.bool,
	canDragNodes: React.PropTypes.bool,
	highlightedLinks: React.PropTypes.arrayOf(
		React.PropTypes.arrayOf(
			React.PropTypes.string
		)
	),

	onNodeSelect: React.PropTypes.func,
	onNodeMouseOver: React.PropTypes.func,
	onNodeMouseOut: React.PropTypes.func
};
