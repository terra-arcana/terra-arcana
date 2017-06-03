import PropTypes from 'prop-types';
import React from 'react';
import ReactKonva from 'react-konva';

/**
 * A Node component displays a single element in a {@link SkillGraph}. This is not
 * intended to be rendered in the graph as-is, but rather extended through components
 * such as {@link SkillNode}, {@link UpgradeNode} or {@link PointNode}.
 * @class
 */
export default class Node extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * The fatness of the stroke displayed on a selected node
		 * @type {Number}
		 */
		this.SELECTED_STROKE = 1;

		this.onClick = this.onClick.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		this.group.on('mouseover', this.onMouseOver);
		this.group.on('dragmove', this.onDragMove);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var background;

		if (this.props.state === 'picked') {
			background = '#F0E5C9';
		} else if (this.props.state === 'start') {
			background = '#F5D850';
		} else {
			background = 'white';
		}

		return (
			<ReactKonva.Group
				ref = {(ref) => this.group = ref}
				x = {this.props.x}
				y = {this.props.y}
				draggable = {this.props.draggable}
				onClick = {this.onClick}
				onDragMove = {this.onDragMove}
				onMouseOver = {this.onMouseOver}
				onMouseOut = {this.onMouseOut}
			>
				<ReactKonva.Circle
					radius = {this.props.size * 0.7}
					fill = {background}
					stroke = {(this.props.state !== 'normal') ? 'black' : 'white'}
					strokeWidth = {0.5}
					listening = {true}
				/>
				<ReactKonva.Path
					ref = {(ref) => this.icon = ref}
					x = {-this.props.size/2}
					y = {-this.props.size/2}
					scale = {{x: 1, y: 1}}
					data = {this.props.icon}
					fill = {this.props.fill}
					listening = {false}
				/>
			</ReactKonva.Group>
		);
	}

	/**
	 * Return the position of the node
	 * @return {Object} The X and Y coordinates
	 */
	getPosition() {
		return {
			x: this.props.x,
			y: this.props.y
		};
	}

	/**
	 * Handle mouse click events
	 * @private
	 */
	onClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.id);
		}
	}

	/**
	 * Handle mouse over events
	 * @private
	 */
	onMouseOver() {
		if (this.props.onMouseOver) {
			this.props.onMouseOver(this.props.id);
		}
	}

	/**
	 * Handle mouse out events
	 * @private
	 */
	onMouseOut() {
		if (this.props.onMouseOut) {
			this.props.onMouseOut();
		}
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
Node.defaultProps = {
	id: '',
	x: 0,
	y: 0,
	fill: 'green',
	draggable: false,
	selected: false
};

/**
 * @type {Object}
 */
Node.propTypes = {
	id: PropTypes.string.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	fill: PropTypes.string,
	draggable: PropTypes.bool,
	selected: PropTypes.bool,
	state: PropTypes.oneOf(['normal', 'picked', 'start']),
	size: PropTypes.number.isRequired,
	icon: PropTypes.string.isRequired,

	onClick: PropTypes.func,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func,
	onDragMove: PropTypes.func
};
