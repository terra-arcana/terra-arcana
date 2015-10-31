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
		radius: 20
	}
}

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
			onMouseOver = {this.onMouseOver.bind(this)}
		/>
	)
}

/**
 * Handle mouse over events
 */
skillNode.onMouseOver = function() {
	console.log('show skill tooltip ' + this.props.id);
}

/* Export */

export default React.createClass(skillNode);
