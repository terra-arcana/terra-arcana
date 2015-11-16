import React from 'react';
import ReactKonva from 'react-konva';

var node = {};

/* Methods */

/**
 * Set initial props
 *
 * @return {object} The initial props
 */
node.getDefaultProps = function() {
	return {
		id: 0,
		x: 100,
		y: 100,
		radius: 15,
		fill: 'green'
	};
};

/**
 * Render the editor
 *
 * @return {jsx} The component template
 */
node.render = function() {
	return (
		<ReactKonva.Circle
			ref = {(ref) => this.circle = ref}
			x = {this.props.x}
			y = {this.props.y}
			radius = {this.props.radius}
			fill = {this.props.fill}
			draggable = "true"
			listening = "true"
			onClick = {this.onClick}
			onDragMove = {this.onDragMove}
			onMouseOver = {this.onMouseOver}
			onMouseOut = {this.props.onMouseOut}
		></ReactKonva.Circle>
	);
};

/**
 * Initialize the component after mounting
 */
node.componentDidMount = function() {
	this.circle.node.on('mouseover', this.onMouseOver);
	this.circle.node.on('dragmove', this.onDragMove);
};

/**
 * Handle mouse over events
 */
node.onMouseOver = function() {
	if (this.props.onMouseOver) {
		this.props.onMouseOver(this.props.id);
	}
};

/**
 * Return the position of the node
 *
 * @return {Object} The X and Y coordinates
 */
node.getPosition = function() {
	return {
		x: this.props.x,
		y: this.props.y
	};
};

/**
 * Handle click events
 */
node.onClick = function() {
	if (this.props.onClick) {
		this.props.onClick(this.props.id);
	}
};

/**
 * Handle drag move events
 */
node.onDragMove = function() {
	if (this.props.onDragMove) {
		this.props.onDragMove(this.props.id, this.circle.node.x(), this.circle.node.y());
	}
};

/* Export */

export default React.createClass(node);
