import React from 'react';
import ReactKonva from 'react-konva';

var nodeLink = {};

/* Methods */

/**
 * Set default props
 *
 * @return {object} The default props
 */
nodeLink.getDefaultProps = function() {
	return {
		x: 50,
		y: 50
	};
}

/**
 * Set initial state
 *
 * @return {object} The initial state
 */
nodeLink.getInitialState = function() {
	return {
		x: this.props.x,
		y: this.props.y
	};
}

/**
 * Render the skill node
 *
 * @return {jsx} The component template
 */
nodeLink.render = function() {
	var points = [0, 0, 100, 100, 150, 100];

	return (
		<ReactKonva.Line
			x = {this.props.x}
			y = {this.props.y}
			points = {points}
			stroke = "black"
			tension = {0}
		></ReactKonva.Line>
	);
}

/* Export */

export default React.createClass(nodeLink);
