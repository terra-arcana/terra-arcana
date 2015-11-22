import React from 'react';

import Node from './node.jsx';

var skillNode = {};

/* Methods */

/**
 * Set default props
 *
 * @return {object} The default props
 */
skillNode.getDefaultProps = function() {
	return {
		id: 0,
		x: 100,
		y: 100,
		radius: 20,
		selected: false
	}
};

/**
 * Render the skill node
 *
 * @return {jsx} The component template
 */
skillNode.render = function() {
	return (
		<Node
			ref = {(ref) => this.node = ref}
			id = {this.props.id}
			x = {this.props.x}
			y = {this.props.y}
			radius = {this.props.radius}
			fill = "red"
			selected = {this.props.selected}
			onClick = {this.props.onClick}
			onDragMove = {this.props.onDragMove}
			onMouseOver = {this.props.onMouseOver}
			onMouseOut = {this.props.onMouseOut}
		></Node>
	)
};

/**
 * Return the position of the node
 * 
 * @return {Object} The X and Y coordinates
 */
skillNode.getPosition = function() {
	return this.node.node.getPosition();
};

/* Export */

export default React.createClass(skillNode);
