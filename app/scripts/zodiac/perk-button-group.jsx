import React from 'react';

/**
 * A PerkButtonGroup is a button group offering control
 * to the user to add or remove a perk on a given skill property. It is meant
 * to be used within a {@link SkillNodeInspector}.
 * @class
 */
export default class PerkButtonGroup extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="btn-group pull-right" role="group">
				{(this.props.currentLevel < this.props.maxLevel) ? (
					<button
						type = "button"
						className = "btn btn-success btn-xs"
						onClick = {this.props.onPerkUpClick}
					>
						<span className="glyphicon glyphicon-chevron-up"></span>&nbsp;
						{this.props.cost}
						<span className="ta-perk-icon sm white"></span>
					</button>
				) : null}
				{(this.props.currentLevel > 0) ? (
					<button
						type = "button"
						className = "btn btn-danger btn-xs"
						onClick = {this.props.onPerkDownClick}
					>
						<span className="glyphicon glyphicon-chevron-down"></span>
						&nbsp;
					</button>
				) : null}
			</div>
		);
	}
}

/**
 * @type {Object}
 */
PerkButtonGroup.propTypes = {
	currentLevel: React.PropTypes.number.isRequired,
	maxLevel: React.PropTypes.number.isRequired,
	cost: React.PropTypes.number.isRequired,

	onPerkUpClick: React.PropTypes.func,
	onPerkDownClick: React.PropTypes.func
};
