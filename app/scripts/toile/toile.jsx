import React from 'react';
import ReactKonva from 'react-konva';

require('../../styles/toile/toile.scss');

var toile = {};

/* Static methods */

var pxStringToNumber = function(str) {
	return parseInt(str.substring(0, str.length - 2));
};

/* Methods */

/**
 * Set initial props
 *
 * @return {Object} The default props
 */
toile.getDefaultProps = function() {
	return {
		canvas: null,
		MAX_HEIGHT: 600,
		WP_BAR_HEIGHT: 32
	};
};

/**
 * Render the editor component
 *
 * @return {jsx} The component template
 */
toile.render = function() {
	return (
		<div className="toile-editor">
			<ReactKonva.Stage ref="stage" draggable="true">
				<ReactKonva.Layer ref="lineLayer">
					<ReactKonva.Rect x={150} y={120} width={50} height={25} fill="black"/>
				</ReactKonva.Layer>
				<ReactKonva.Layer ref="nodeLayer">
					<ReactKonva.Circle x={100} y={100} radius={80} fill="red"/>
				</ReactKonva.Layer>
			</ReactKonva.Stage>
			<div ref="tooltip" id="toile-editor-tooltip" className="toile-editor-tooltip"/>
		</div>
	);
};

/**
 * Initialize the component after mounting
 */
toile.componentDidMount = function() {
	var root = React.findDOMNode(this);

	this.props.canvas = root.firstChild.firstChild.firstChild.getElementsByTagName('canvas');

	window.addEventListener('resize', this.draw);
	this.refs.stage.node.on('dragmove', this.draw);

	this.draw();
};

/**
 * Redraw the canvas and its contents
 */
toile.draw = function() {
	this.resizeCanvas();
	this.refs.stage.node.draw();
};

/**
 * Get the desired size of the editor canvas
 * 
 * @return {Object} The desired width and height of the editor canvas
 */
toile.getEditorSize = function() {
	var	root = React.findDOMNode(this),
	 	editorStyle = window.getComputedStyle(root),
		parentStyle = window.getComputedStyle(root.parentNode),
		margins = {
			left: pxStringToNumber(editorStyle.marginLeft),
			right: pxStringToNumber(editorStyle.marginRight),
			top: pxStringToNumber(editorStyle.marginTop),
			bottom: pxStringToNumber(editorStyle.marginBottom)
		},
		parentPaddings = {
			left: pxStringToNumber(parentStyle.paddingLeft),
			right: pxStringToNumber(parentStyle.paddingRight)
		},
		width, height;

	// Calculate width by taking into account paddings and margins
	width = root.parentNode.offsetWidth - margins.left - margins.right - parentPaddings.left - parentPaddings.right;
	height = Math.min(
		width * 0.75,
		window.innerHeight - margins.top - margins.bottom - this.props.WP_BAR_HEIGHT,
		this.props.MAX_HEIGHT
	);

	return {
		w: width,
		h: height
	};
};

/**
 * Resizes the editor canvas to its wrapper width
 */
toile.resizeCanvas = function() {
	var	editorSize = this.getEditorSize(),
		root = React.findDOMNode(this);

	root.setAttribute('style', 'width: ' + editorSize.w + 'px; height: ' + editorSize.h + 'px;');

	for (var i = 0; i < this.props.canvas.length; i++) {
		this.props.canvas[i].width = editorSize.w;
		this.props.canvas[i].height = editorSize.h;
	}
};

/* Export */

export default React.createClass(toile);
