import React from 'react';

require('../../styles/toile/details-panel.scss');

/**
 * Details panel component
 *
 * @class
 */
export default class DetailsPanel extends React.Component {
	
	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div className="toile-editor-details-panel col-lg-4 col-sm-12">
				Details of node #{this.props.id}
			</div>
		);
	}
}

/**
 * Default props
 * 
 * @type {Object}
 */
DetailsPanel.defaultProps = {
	id: ''
};
