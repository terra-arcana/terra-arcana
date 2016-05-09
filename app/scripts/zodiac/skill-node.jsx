import React from 'react';

import Node from './node.jsx';

var icon = require('../../images/zodiac/skill.svg');

/**
 * A SkillNode is a canvas element representing a skill on a {@link SkillGraph}.
 * @class
 */
export default class SkillNode extends React.Component {

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
				size = {36}
				icon = {this.ICON_DATA}
				fill = "#99601F"
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
