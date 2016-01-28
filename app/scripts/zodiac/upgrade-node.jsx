import React from 'react';

import Node from './node.jsx';

/**
 * An UpgradeNode is a canvas element representing an upgrade of a 
 * single {@link SkillNode} on a {@link SkillGraph}. An UpgradeNode should always have 
 * a single link, either to its parent SkillNode or to another UpgradeNode related 
 * to the same SkillNode.
 * @class
 */
export default class UpgradeNode extends React.Component {

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
				fill = "purple"
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
UpgradeNode.defaultProps = {
	id: '',
	x: 0,
	y: 0,
	radius: 8,
	selected: false
};

/**
 * @type {Object}
 */
UpgradeNode.propTypes = {
	id: React.PropTypes.string.isRequired,
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	radius: React.PropTypes.number,
	selected: React.PropTypes.bool,

	onClick: React.PropTypes.func,
	onDragMove: React.PropTypes.func,
	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func
};
