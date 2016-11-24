import React from 'react';

import Node from './node.jsx';

var icon = require('../../images/zodiac/upgrade.svg');

/**
 * An UpgradeNode is a canvas element representing an upgrade of a
 * single {@link SkillNode} on a {@link SkillGraph}. An UpgradeNode should always have
 * a single link, either to its parent SkillNode or to another UpgradeNode related
 * to the same SkillNode.
 * @class
 */
export default class UpgradeNode extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		// Parse icon SVGs
		var parser = new DOMParser(),
			parsedIcon = parser.parseFromString(icon, 'image/svg+xml');

		this.ICON_DATA = jQuery(parsedIcon).find('path').attr('d');
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
				size = {24}
				icon = {this.ICON_DATA}
				fill = "#6E400B"
				selected = {this.props.selected}
				state = {this.props.state}
				draggable = {this.props.draggable}
				onClick = {this.props.onClick}
				onDragMove = {this.props.onDragMove}
				onMouseOver = {this.props.onMouseOver}
				onMouseOut = {this.props.onMouseOut}
			/>
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
	state: React.PropTypes.oneOf(['normal', 'picked', 'start']),
	draggable: React.PropTypes.bool,

	onClick: React.PropTypes.func,
	onDragMove: React.PropTypes.func,
	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func
};
