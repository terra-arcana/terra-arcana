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
				{this.props.name}
				<ul>
					{this.props.upgrades.map(function(upgrade) {
						return (
							<li><small>{upgrade.name}</small></li>
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
 * @type {Object}
 */
CharacterSkillsPanelSkillElement.defaultProps = {
	id: '',
	upgrades: [],
	active: false
};

/**
 * @type {Object}
 */
CharacterSkillsPanelSkillElement.propTypes = {
	id: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	upgrades: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired
		})
	),
	active: React.PropTypes.bool,

	onSelect: React.PropTypes.func
};
