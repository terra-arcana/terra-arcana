import React from 'react';
import ReactKonva from 'react-konva';

/**
 * Node link component
 *
 * @class
 */
export default class NodeLink extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
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
	}
}

/**
 * Default props
 * 
 * @type {Object}
 */
NodeLink.defaultProps = {
	from: {
		x: 0, 
		y: 0
	},
	to: {
		x: 0, 
		y: 0
	}
};
