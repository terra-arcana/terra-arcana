/* global describe, it */

var TestUtils = require('react-addons-test-utils'),
	Lodash = require('lodash'),
	expect = require('expect'),
	ZodiacEditor = require('../zodiac/zodiac-editor.jsx');

describe('ZodiacEditor', function() {
	it('correctly initializes the active node', function() {
		var editor = TestUtils.renderIntoDocument(
				<ZodiacEditor/>
			),
			defaultActiveNode = {
				id: '',
				type: '',
				upgrades: []
			};

		expect(Lodash.isEqual(editor.state.activeNode, defaultActiveNode)).toEqual(true);
	});

	it('correctly adds a life node upon clicking new life node button', function() {
		var editor = TestUtils.renderIntoDocument(
				<ZodiacEditor/>
			),
			defaultLifeNode = {
				id: 'new-1',
				type: 'life',
				value: '0',
				x: '0',
				y: '0'
			};

		TestUtils.Simulate.click(editor.addLifeNodeButton);

		expect(Lodash.isEqual(editor.getNodeDataById('new-1'), defaultLifeNode)).toEqual(true);
	});
});
