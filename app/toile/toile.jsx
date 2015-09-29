/* jshint ignore: start */

import React from 'react';
import ReactKonva from 'react-konva';

require('../styles/toile/toile.scss');

export default React.createClass({
	getDefaultProps: getDefaultProps,
	render: render,
	componentDidMount: componentDidMount,
	draw: draw,
	getEditorSize: getEditorSize,
	resizeCanvas: resizeCanvas
});

function getDefaultProps() {
	return {
		canvas: null,
		MAX_HEIGHT: 600,
		WP_BAR_HEIGHT: 32
	};
}

function render() {
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
}

function componentDidMount() {
	var root = React.findDOMNode(this);

	this.props.canvas = root.firstChild.firstChild.firstChild.getElementsByTagName('canvas');

	window.addEventListener('resize', this.draw);
	this.refs.stage.node.on('dragmove', this.draw);

	this.draw();
}

function draw() {
	this.resizeCanvas();
	this.refs.stage.node.draw();
}

function getEditorSize() {
	var	root = React.findDOMNode(this),
	 	editorStyle = window.getComputedStyle(root),
		margins = {
			left: pxStringToNumber(editorStyle.marginLeft),
			right: pxStringToNumber(editorStyle.marginRight),
			top: pxStringToNumber(editorStyle.marginTop),
			bottom: pxStringToNumber(editorStyle.marginBottom)
		},
		width, height;

	// FIXME: Calculate based on parent node width instead of window
	width = window.innerWidth - margins.left - margins.right;
	height = Math.min(
		width * 0.75,
		window.innerHeight - margins.top - margins.bottom - this.props.WP_BAR_HEIGHT,
		this.props.MAX_HEIGHT
	);

	return {
		w: width,
		h: height
	};
}

function pxStringToNumber(str) {
	return parseInt(str.substring(0, str.length - 2));
}

function resizeCanvas() {
	var	editorSize = this.getEditorSize(),
		root = React.findDOMNode(this);

	root.setAttribute('style', 'width: ' + editorSize.w + 'px; height: ' + editorSize.h + 'px;');

	for (var i = 0; i < this.props.canvas.length; i++) {
		this.props.canvas[i].width = editorSize.w;
		this.props.canvas[i].height = editorSize.h;
	}
}
