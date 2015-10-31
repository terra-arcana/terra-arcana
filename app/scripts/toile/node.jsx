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
	this.props.onClick = this.props.onClick || this.onClick.bind(this);
	this.props.onDragMove = this.props.onDragMove || this.onDragMove.bind(this);
	this.props.onMouseOver = this.props.onMouseOver || this.onMouseOver.bind(this);

	return (
		<ReactKonva.Circle
			ref = {(ref) => this.circle = ref}
			x = {this.state.x}
			y = {this.state.y}
			radius = {this.props.radius}
			fill = {this.props.fill}
			draggable = "true"
			listening = "true"
			onClick = {this.props.onClick}
			onDragMove = {this.props.onDragMove}
			onMouseOver = {this.props.onMouseOver}
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
	console.log('show tooltip ' + this.props.id);
};

/**
 * Handle click events
 */
node.onClick = function() {
	console.log('select node ' + this.props.id);
};

/**
 * Handle drag move events
 */
node.onDragMove = function() {
	this.setState({
		x: this.circle.node.x(),
		y: this.circle.node.y()
	});
};

/* Export */

export default React.createClass(node);
