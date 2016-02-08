/* global describe, it */

var TestUtils = require('react-addons-test-utils'),
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
});
