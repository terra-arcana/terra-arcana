import React from 'react';

/**
 * A PointNodeInspector component displays the details of a energy(life) 
 * or perk node that has been selected by the user in a {@link SkillGraph}.
 * @class
 */
export default class PointNodeInspector extends React.Component {
	
	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var titleText = this.props.pointNode.value + ' points',
			bodyText = '';

		// TODO: Fetch those values from ACF
		switch(this.props.pointNode.type) {
		case 'life':
			titleText += ' d\'énergie';
			bodyText = 'L\'énergie augmente votre endurance et résistance de votre personnage. Elle symbolise le montant de dégâts que votre personnage peut encaisser, ainsi que le nombre de fois qu\'il peut utiliser certaines compétences.';
			break;
		case 'perk':
			titleText += ' d\'essence';
			bodyText = 'L\'essence peut être utilisée pour personnaliser et augmenter la puissance des compétences existantes de votre personnage.';
			break;
		}

		return (
			<div className='col-xs-12 col-lg-4'>
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h2 className='panel-title'>{titleText}</h2>
					</div>
					<div className='panel-body'>
						{bodyText}
					</div>
				</div>
			</div>
		);
	}
}

/**
 * @type {Object}
 */
PointNodeInspector.defaultProps = {
	pointNode: {
		id: '',
		type: '',
		value: ''
	}
};

/**
 * @type {Object}
 */
PointNodeInspector.propTypes = {
	pointNode: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		type: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired
	})
};
