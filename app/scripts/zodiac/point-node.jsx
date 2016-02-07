import React from 'react';

import Node from './node.jsx';

/**
 * A PointNode is a {@link Node} containing a certain amount of points of a given currency.
 * @class
 */
export default class PointNode extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * Node radius in pixels
		 * @type {Number}
		 */
		this.NODE_RADIUS = 15;

		/**
		 * Colors of nodes
		 * @type {Object}
		 */
		this.NODE_COLORS = {
			'life': 'green',
			'perk': 'orange'
		};
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<Node
				ref = {(ref) => this.node = ref}
				id = {this.props.id}
				x = {this.props.x}
				y = {this.props.y}
				radius = {this.NODE_RADIUS}
				fill = {this.NODE_COLORS[this.props.type]}
				selected = {this.props.selected}
				draggable = {this.props.draggable}
				onClick = {this.props.onClick}
				onDragMove = {this.props.onDragMove}
				onMouseOver = {this.props.onMouseOver}
				onMouseOut = {this.props.onMouseOut}
			></Node>
		);
	}
}

/**
 * @type {Object}
 */
PointNode.defaultProps = {
	id: '',
	x: 0,
	y: 0, 
	type: 'life',
	selected: false,
	draggable: false
};

/**
 * @type {Object}
 */
PointNode.propTypes = {
	id: React.PropTypes.string.isRequired,
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	type: React.PropTypes.string.isRequired,
	selected: React.PropTypes.bool,
	draggable: React.PropTypes.bool,

	onClick: React.PropTypes.func,
	onDragMove: React.PropTypes.func,
	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func
};
