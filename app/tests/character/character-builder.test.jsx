/* global describe, it */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'; 
import expect from 'expect';
import Lodash from 'lodash';
import CharacterBuilder from '../../scripts/character/character-builder.jsx';

describe('CharacterBuilder', function() {
	it('adds perks to character', function() {
		var builder = ReactTestUtils.renderIntoDocument(
				<CharacterBuilder
					character = {{
						'current_build': [
							{
								id: '1',
								type: 'skill',
								name: 'Skill 1',
								perks: [{
									power: 0,
									cast: 1,
									duration: 0,
									range: 0,
									uses: 1
								}]
							}
						],
						title: { rendered: 'Test' },
						people: {
							id: 3,
							name: 'Québécois',
							singular: 'québécois'
						},
						xp: {
							total: 8,
							base: 8,
							from_user: 0,
							from_events: 0,
							bonus: 0
						},
						'perk_points': {
							total: 3,
							nodes: 0,
							bonus: 3
						}
					}}
				/>
			),
			expectedStartingBalance = {
				current: 0,
				total: 3
			},
			expectedBalanceAfterPurchase = {
				current: -3,
				total: 3
			},
			expectedBalanceAfterNewPerkNode = {
				current: -1,
				total: 5
			},
			expectedBalanceAfterRefund = {
				current: 2,
				total: 5
			};

		// Inject mock data to the builder since we won't wait for the AJAX request to finish
		builder.state.nodeData = [
			{
				id: '1',
				type: 'skill',
				name: 'Skill 1',
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
			builder.calculateCurrentPerkBalance(builder.state.currentBuild),
			expectedStartingBalance
		)).toEqual(true);

		builder.selectPerk('1', 'power', 'up');
		expect(Lodash.isEqual(
			builder.calculateCurrentPerkBalance(builder.state.currentBuild),
			expectedBalanceAfterPurchase
		)).toEqual(true);

		builder.selectNode('2');
		expect(Lodash.isEqual(
			builder.calculateCurrentPerkBalance(builder.state.currentBuild),
			expectedBalanceAfterNewPerkNode
		)).toEqual(true);

		builder.selectPerk('1', 'uses', 'down');
		expect(Lodash.isEqual(
			builder.calculateCurrentPerkBalance(builder.state.currentBuild),
			expectedBalanceAfterRefund
		)).toEqual(true);
	});
});
