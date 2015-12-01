import React from 'react';

/**
 * A character skills panel skill element is a skill and its selected upgrades 
 * displayed in a character skills panel.
 *
 * @class
 */
export default class CharacterSkillsPanelSkillElement extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props Component props
	 */
	constructor(props) {
		super(props);

		this.onMouseOver = this.onMouseOver.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<li className='list-group-item' onMouseOver={this.onMouseOver} onMouseOut={this.props.onMouseOut}>
				Skill #{this.props.id}
				<ul>
					{this.props.upgrades.map(function(upgrade) {
						return (
							<li><small>Upgrade #{upgrade.id}</small></li>
						);
					})}
				</ul>
			</li>
		);
	}

	/**
	 * Handle mouse over events
	 */
	onMouseOver() {
		if (this.props.onMouseOver) {
			this.props.onMouseOver({
				id: this.props.id,
				upgrades: this.props.upgrades
			});
		}
	}
}

/**
 * Default props
 * 
 * @type {Object}
 */
CharacterSkillsPanelSkillElement.defaultProps = {
	id: '',
	upgrades: []
};
