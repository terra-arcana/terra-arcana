/* global describe, it */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'; 
import expect from 'expect';
import Lodash from 'lodash';
import SkillGraph from '../../scripts/zodiac/skill-graph.jsx';

describe('SkillGraph', function() {
	it('has constants defined', function() {
		var graph = ReactTestUtils.renderIntoDocument(
			<SkillGraph/>
		);

		expect(graph.MAX_HEIGHT).toEqual(600);
		expect(graph.WP_BAR_HEIGHT).toEqual(32);
	});

	it('returns start nodes', function() {
		var graph = ReactTestUtils.renderIntoDocument(
				<SkillGraph
					initialNodeData = {[
						{
							id: '1',
							name: 'Skill 1',
							x: 10,
							y: 10,
							type: 'skill',
							start: true
						},
						{
							id: '2',
							name: 'Skill 2',
							x: 10,
							y: 20,
							type: 'skill',
							start: false
						},
						{
							id: '3',
							name: 'Skill 3',
							x: 30,
							y: 50,
							type: 'skill',
							start: false
						},
						{
							id: '4',
							name: 'Skill 4',
							x: 80,
							y: 20,
							type: 'skill',
							start: true
						}
					]}
				/>
			),
			expectedStartNodes = ['1', '4'];

		expect(Lodash.isEqual(graph.getStartNodes(), expectedStartNodes)).toEqual(true);
	});
});
