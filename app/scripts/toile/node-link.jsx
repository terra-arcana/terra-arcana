import React from 'react';
import ReactKonva from 'react-konva';

var nodeLink = {
	displayName: 'NodeLink'
};

/* Methods */

/**
 * Set default props
 *
 * @return {object} The default props
 */
nodeLink.getDefaultProps = function() {
	return {
		from: {x: 0, y: 0},
		to: {x: 0, y: 0}
	};
};

/**
 * Render the skill node
 *
 * @return {jsx} The component template
 */
nodeLink.render = function() {
	var points = [
		0, 0,
		this.props.to.x - this.props.from.x,
		this.props.to.y - this.props.from.y
	];

	return (
		<ReactKonva.Line
			x = {this.props.from.x}
			y = {this.props.from.y}
			points = {points}
			stroke = "black"
			tension = {0}
		></ReactKonva.Line>
	);
};

/* Export */

export default React.createClass(nodeLink);
