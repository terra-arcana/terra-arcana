import React from 'react';
import ReactKonva from 'react-konva';

/**
 * A NodeLink links two {@link Node} components together in a {@link SkillGraph}.
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
				stroke = {(this.props.highlighted) ? 'red' : 'black'}
				tension = {0}
			/>
		);
	}
}

/**
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
	},
	highlighted: false
};

/**
 * @type {Object}
 */
NodeLink.propTypes = {
	from: React.PropTypes.shape({
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired
	}),
	to: React.PropTypes.shape({
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired
	}),
	highlighted: React.PropTypes.bool
};
