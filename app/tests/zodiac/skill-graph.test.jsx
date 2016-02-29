/* global describe, it */

var Lodash = require('lodash'),
	TestUtils = require('react-addons-test-utils'),
	expect = require('expect'),
	SkillGraph = require('../../scripts/zodiac/skill-graph.jsx');

describe('SkillGraph', function() {
	it('has constants defined', function() {
		var graph = TestUtils.renderIntoDocument(
			<SkillGraph/>
		);

		expect(graph.MAX_HEIGHT).toEqual(600);
		expect(graph.WP_BAR_HEIGHT).toEqual(32);
	});

	it('correctly return start nodes', function() {
		var graph = TestUtils.renderIntoDocument(
			<SkillGraph
				initialNodeData = {[
					{
						id: '1',
						x: 10,
						y: 10,
						type: 'skill',
						start: true
					},
					{
						id: '2',
						x: 10,
						y: 20,
						type: 'skill',
						start: false
					},
					{
						id: '3',
						x: 30,
						y: 50,
						type: 'skill',
						start: false
					},
					{
						id: '4',
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
