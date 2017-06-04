/* global describe, it */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import expect from 'expect';
import Lodash from 'lodash';
import ZodiacViewerPage from '../../scripts/zodiac/zodiac-viewer.page.jsx';

describe('ZodiacViewerPage', function() {
	it ('inspects nodes', function() {
		var viewer = ReactTestUtils.renderIntoDocument(
				<ZodiacViewerPage/>
			),
			expectedInitialActiveNode = {
				id: '',
				type: '',
				upgrades: []
			},
			expectedInspectedNode = {
				id: '2',
				type: 'perk',
				upgrades: []
			};

		// Inject mock data to the viewer since we won't wait for the AJAX request to finish
		viewer.state.nodeData = [
			{
				id: '1',
				type: 'skill',
				perks: [{
					power: 1,
					cast: 1,
					duration: 0,
					range: 0,
					uses: 1
				}],
				x: 10,
				y: 10
			},
			{
				id: '2',
				type: 'perk',
				value: '2',
				x: 10,
				y: 10
			}
		];

		expect(Lodash.isEqual(
			viewer.state.activeNode,
			expectedInitialActiveNode
		)).toEqual(true);

		viewer.inspectSkill('1');
		expect(Lodash.isEqual(
			viewer.state.activeNode,
			expectedInspectedNode
		)).toEqual(true);

		viewer.uninspect();
		expect(Lodash.isEqual(
			viewer.state.activeNode,
			expectedInitialActiveNode
		)).toEqual(true);
	});
});
