import React from 'react';

import Node from './node.jsx';

/**
 * A SkillNode is a canvas element representing a skill on a SkillGraph.
 *
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
				onClick = {this.props.onClick}
				onDragMove = {this.props.onDragMove}
				onMouseOver = {this.props.onMouseOver}
				onMouseOut = {this.props.onMouseOut}
			></Node>
		);
	}

	/**
	 * Return the position of the node
	 * 
	 * @return {Object} The X and Y coordinates
	 */
	getPosition() {
		return this.node.node.getPosition();
	}
}

/**
 * Default props
 * 
 * @type {Object}
 */
SkillNode.defaultProps = {
	id: '',
	x: 100,
	y: 100,
	radius: 20,
	selected: false
};
