import React from 'react';
import ReactKonva from 'react-konva';

import Node from './node.jsx';

var lifeIcon = require('../../images/zodiac/life.svg'),
	perkIcon = require('../../images/zodiac/perk.svg');

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
			'life': '#128020',
			'perk': '#069992'
		};

		this.onDragMove = this.onDragMove.bind(this);

		// Parse icon SVGs
		var parser = new DOMParser(),
			parsedLifeIcon = parser.parseFromString(lifeIcon, 'image/svg+xml'),
			parsedPerkIcon = parser.parseFromString(perkIcon, 'image/svg+xml');

		this.PERK_ICON_DATA = jQuery(parsedPerkIcon).find('path').attr('d');
		this.LIFE_ICON_DATA = jQuery(parsedLifeIcon).find('path').attr('d');
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var icon = null;

		if (this.props.type === 'life') {
			icon = this.LIFE_ICON_DATA;
		} else {
			icon = this.PERK_ICON_DATA;
		}

		return (
			<ReactKonva.Group
				ref = {(ref) => this.group = ref}
				x = {this.props.x}
				y = {this.props.y}
				draggable = {this.props.draggable}
				onDragMove = {this.onDragMove}
			>
				<Node
					ref = {(ref) => this.node = ref}
					id = {this.props.id}
					size = {36}
					icon = {icon}
					fill = {this.NODE_COLORS[this.props.type]}
					selected = {this.props.selected}
					state = {this.props.state}
					draggable = {false}
					onClick = {this.props.onClick}
					onMouseOver = {this.props.onMouseOver}
					onMouseOut = {this.props.onMouseOut}
				/>

				<ReactKonva.Text
					ref = {(ref) => this.label = ref}
					x = {-5}
					y = {-9}
					text = {this.props.value}
					fontSize = {18}
					fontStyle = "bold"
					align = "center"
					listening = {false}
				/>
			</ReactKonva.Group>
		);
	}

	/**
	 * Handle drag move events
	 * @private
	 */
	onDragMove() {
		if (this.props.onDragMove) {
			this.props.onDragMove(this.props.id, this.group.x(), this.group.y());
		}
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
	value: '0',
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
	value: React.PropTypes.string.isRequired,
	selected: React.PropTypes.bool,
	state: React.PropTypes.oneOf(['normal', 'picked', 'start']),
	draggable: React.PropTypes.bool,

	onClick: React.PropTypes.func,
	onDragMove: React.PropTypes.func,
	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func
};
