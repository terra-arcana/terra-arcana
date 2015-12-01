import React from 'react';

require('../../styles/toile/skill-tooltip.scss');

/**
 * Details panel component
 *
 * @class
 */
export default class SkillTooltip extends React.Component {

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className='toile-editor-skill-tooltip'>
				{this.props.skill.upgrades.map(function(upgrade) {
					return (
						<div className='panel panel-info upgrade-panel'>
							<div className='panel-heading'>
								<h3 className='panel-title'>Upgrade #{upgrade}</h3>
							</div>
							<div className='panel-body'>
								<p>Description de l'upgrade</p>
							</div>
						</div>
					);
				}.bind(this))}

				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h2 className='panel-title'>Nom de skill vraiment long #{this.props.skill.id} <small>Instant&nbsp;|&nbsp;Thaumaturge</small></h2>
					</div>
					<div className='panel-body'>
						<p>Description du skill blablabla</p>
						<table className='skill-details-table table table-bordered table-condensed'>
							<tr>
								<td>Coût <a className="btn btn-default btn-xs" href="#" role="button">Améliorer</a></td>
								<td>2 Énergie, 1 Pierre, 1 Racine</td>
							</tr>
							<tr>
								<td>Durée <a className="btn btn-default btn-xs" href="#" role="button">Améliorer</a></td>
								<td>1 minute</td>
							</tr>
							<tr>
								<td>Incantation <a className="btn btn-default btn-xs" href="#" role="button">Améliorer</a></td>
								<td>6 secondes</td>
							</tr>
							<tr>
								<td>Portée <a className="btn btn-default btn-xs" href="#" role="button">Améliorer</a></td>
								<td>Contact</td>
							</tr>
						</table>

						<p><em>Flavor text du skill</em></p>
					</div>
				</div>
			</div>
		);
	}
}

/**
 * Default props
 * 
 * @type {Object}
 */
SkillTooltip.defaultProps = {
	skill: {
		id: '',
		upgrades: []
	}
};
