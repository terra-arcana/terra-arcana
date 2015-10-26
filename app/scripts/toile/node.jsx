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
		radius: 20,
		fill: 'green'
	};
};

/**
 * Set initial state
 *
 * @return {object} The initial state
 */
node.getInitialState = function() {
	return {
		x: this.props.x,
		y: this.props.y
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
			x = {this.state.x}
			y = {this.state.y}
			radius = {this.props.radius}
			fill = {this.props.fill}
			draggable = "true"
			listening = "true"
			onClick = {this.onClick}
			onDragMove = {this.onDragMove}
			onMouseOver = {this.onMouseOver}
		/>
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
	console.log('mouseover ' + this.props.id);
};

/**
 * Handle click events
 */
node.onClick = function() {
	console.log('click ' + this.props.id);
};

/**
 * Handle drag move events
 */
node.onDragMove = function() {
	console.log('dragmove ' + this.props.id);
};

/* Export */

export default React.createClass(node);
