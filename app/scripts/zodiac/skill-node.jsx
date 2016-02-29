import React from 'react';

import Node from './node.jsx';

/**
 * A SkillNode is a canvas element representing a skill on a {@link SkillGraph}.
 * @class
 */
export default class SkillNode extends React.Component {

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
				radius = {this.props.radius}
				fill = "red"
				selected = {this.props.selected}
				draggable = {this.props.draggable}
				onClick = {this.props.onClick}
				onDragMove = {this.props.onDragMove}
				onMouseOver = {this.props.onMouseOver}
				onMouseOut = {this.props.onMouseOut}
			/>
		);
	}

	/**
	 * Return the position of the node
	 * @return {Object} The X and Y coordinates
	 */
	getPosition() {
		return this.node.node.getPosition();
	}
}

/**
 * @type {Object}
 */
SkillNode.defaultProps = {
	id: '',
	x: 100,
	y: 100,
	radius: 20,
	selected: false,
	draggable: false
};

/**
 * @type {Object}
 */
SkillNode.propTypes = {
	id: React.PropTypes.string.isRequired,
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	radius: React.PropTypes.number,
	selected: React.PropTypes.bool,
	draggable: React.PropTypes.bool,

	onClick: React.PropTypes.func,
	onDragMove: React.PropTypes.func,
	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func
};
