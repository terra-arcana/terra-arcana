import PropTypes from 'prop-types';
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
				strokeWidth = {0.5}
				tension = {5}
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
	from: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired
	}),
	to: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired
	}),
	highlighted: PropTypes.bool
};
