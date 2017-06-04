/* global describe, it */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import expect from 'expect';
import Lodash from 'lodash';
import ZodiacEditor from '../zodiac/zodiac-editor.jsx';

describe('ZodiacEditor', function() {
	it('initializes the active node', function() {
		var editor = ReactTestUtils.renderIntoDocument(
				<ZodiacEditor/>
			),
			defaultActiveNode = {
				id: '',
				type: '',
				upgrades: []
			};

		expect(Lodash.isEqual(editor.state.activeNode, defaultActiveNode)).toEqual(true);
	});

	it('adds a life node upon clicking new life node button', function() {
		var editor = ReactTestUtils.renderIntoDocument(
				<ZodiacEditor/>
			),
			defaultLifeNode = {
				id: 'n0',
				type: 'life',
				value: '0',
				x: 0,
				y: 0
			};

		ReactTestUtils.Simulate.click(editor.addLifeNodeButton);

		expect(Lodash.isEqual(editor.getNodeDataById('n0'), defaultLifeNode)).toEqual(true);
	});

	it('edits life node values', function() {
		var editor = ReactTestUtils.renderIntoDocument(
			<ZodiacEditor />
		);

		editor.setState({
			nodeData: [{
				id: '0',
				x: 0,
				y: 0,
				type: 'life',
				value: '1'
			}],
			activeNode: {
				id: '0',
				type: 'life',
				upgrades: []
			}
		});

		editor.pointNodeValueInput.value = '5';
		ReactTestUtils.Simulate.change(editor.pointNodeValueInput);

		expect(editor.getNodeDataById('0').value).toEqual('5');
	});

	it('deletes life nodes', function() {
		var editor = ReactTestUtils.renderIntoDocument(
			<ZodiacEditor />
		);

		editor.setState({
			nodeData: [
				{
					id: '12',
					x: 0,
					y: 0,
					type: 'skill'
				},
				{
					id: '18',
					x: 100,
					y: 100,
					type: 'life',
					value: '1'
				},
				{
					id: '20',
					x: 200,
					y: 200,
					type: 'perk',
					value: '3'
				}
			],
			linkData: [
				['12', '18'],
				['18', '20'],
				['12', '20']
			],
			activeNode: {
				id: '18',
				type: 'life',
				upgrades: []
			},
			deletedNodes: []
		});

		ReactTestUtils.Simulate.click(editor.deletePointNodeButton);

		expect(Lodash.isEqual(editor.state.nodeData, [
			{
				id: '12',
				x: 0,
				y: 0,
				type: 'skill'
			},
			{
				id: '20',
				x: 200,
				y: 200,
				type: 'perk',
				value: '3'
			}
		])).toEqual(true);

		expect(Lodash.isEqual(editor.state.linkData, [
			['12', '20']
		])).toEqual(true);

		expect(Lodash.isEqual(editor.state.activeNode, {
			id: '',
			type: '',
			upgrades: []
		})).toEqual(true);

		expect(Lodash.isEqual(editor.state.deletedNodes, ['18'])).toEqual(true);
	});

	it('edits start node properties', function() {
		var editor = ReactTestUtils.renderIntoDocument(
			<ZodiacEditor />
		);

		editor.setState({
			nodeData: [
				{
					id: '4',
					x: 100,
					y: 100,
					type: 'skill',
					start: false
				}
			],
			activeNode: {
				id: '4',
				type: 'skill',
				upgrades: []
			}
		});

		ReactTestUtils.Simulate.change(editor.startNodeButton, {
			target: {
				checked: true
			}
		});

		expect(editor.getNodeDataById('4').start).toEqual(true);
	});
});
