import React from 'react';

/**
 * A CharacterSkillsPanelSkillElement is a skill and its selected upgrades 
 * displayed in a {@link CharacterSkillsPanel}.
 * @class
 */
export default class CharacterSkillsPanelSkillElement extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props Component props
	 */
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var classes = ['list-group-item'];

		if (this.props.active) {
			classes.push('active');
		}


		return (
			<a href='#' className={classes.join(' ')} onClick={this.onClick}>
				Skill #{this.props.id}
				<ul>
					{this.props.upgrades.map(function(upgrade) {
						return (
							<li><small>Upgrade #{upgrade.id}</small></li>
						);
					})}
				</ul>
			</a>
		);
	}

	/**
	 * Handle click events
	 */
	onClick() {
		if (this.props.onSelect) {
			this.props.onSelect({
				id: this.props.id,
				upgrades: this.props.upgrades
			});
		}
	}
}

/**
 * Default props
 * @type {Object}
 */
CharacterSkillsPanelSkillElement.defaultProps = {
	id: '',
	upgrades: [],
	active: false
};
