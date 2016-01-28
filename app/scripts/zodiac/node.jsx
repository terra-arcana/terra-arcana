import React from 'react';
import ReactKonva from 'react-konva';

/**
 * Node component
 * @class
 */
export default class Node extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var stroke = (this.props.selected) ? this.SELECTED_STROKE : 0;

		return (
			<ReactKonva.Circle
				ref = {(ref) => this.circle = ref}
				x = {this.props.x}
				y = {this.props.y}
				radius = {this.props.radius}
				fill = {this.props.fill}
				stroke = {stroke}
				draggable = {this.props.draggable}
				listening = {true}
				onClick = {this.onClick}
				onDragMove = {this.onDragMove}
				onMouseOver = {this.onMouseOver}
				onMouseOut = {this.onMouseOut}
			></ReactKonva.Circle>
		);
	}

	/**
	 * @override
	 */
	componentWillMount() {
		/**
		 * The fatness of the stroke displayed on a selected node
		 * @type {Number}
		 */
		this.SELECTED_STROKE = 5;
	}

	/**
	 * @override
	 */
	componentDidMount() {
		this.circle.node.on('mouseover', this.onMouseOver);
		this.circle.node.on('dragmove', this.onDragMove);
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
			this.props.onDragMove(this.props.id, this.circle.node.x(), this.circle.node.y());
		}
	}
}

/**
 * @type {Object}
 */
Node.defaultProps = {
	id: '',
	x: 100,
	y: 100,
	radius: 15,
	fill: 'green',
	draggable: false,
	selected: false
};

/**
 * @type {Object}
 */
Node.propTypes = {
	id: React.PropTypes.string.isRequired,
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	radius: React.PropTypes.number,
	fill: React.PropTypes.string,
	draggable: React.PropTypes.bool,
	selected: React.PropTypes.bool
};
