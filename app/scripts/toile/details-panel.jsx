import React from 'react';

require('../../styles/toile/details-panel.scss');

var detailsPanel = {
	displayName: 'DetailsPanel'
};

/* Methods */

/**
 * Set initial props
 *
 * @return {Object} The default props
 */
detailsPanel.getDefaultProps = function() {
	return {
		id: 0
	}
};

/**
 * Render the details panel
 *
 * @return {jsx} The component template
 */
detailsPanel.render = function() {
	return (
		<div className="toile-editor-details-panel col-lg-4 col-sm-12">
			Details of node #{this.props.id}
		</div>
	);
};

/* Export */

export default React.createClass(detailsPanel);
