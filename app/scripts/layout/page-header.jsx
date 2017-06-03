import PropTypes from 'prop-types';
import React from 'react';

import Breadcrumbs from './breadcrumbs.jsx';

require('../../styles/layout/page-header.scss');

export default class PageHeader extends React.Component {
	render() {
		const breadcrumbs = (this.props.breadcrumbs.length)
			? <Breadcrumbs links={this.props.breadcrumbs} />
			: null;
		const contentClasses = (this.props.articleMode)
			? 'col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'
			: 'col-xs-12';

		return (
			<div className="ta-page-header">
				<div className="container">
					<div className="row">
						<div className={contentClasses}>
							<h1
								className = "page-header"
								dangerouslySetInnerHTML = {{__html: this.props.content }}
							/>
							{breadcrumbs}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

/**
 * @type {Object}
 */
PageHeader.propTypes = {
	articleMode: PropTypes.bool,
	breadcrumbs: PropTypes.arrayOf(
		PropTypes.shape({
			uri: PropTypes.string,
			caption: PropTypes.string.isRequired
		})
	),
	content: PropTypes.string
};

/**
 * @type {Object}
 */
PageHeader.defaultProps = {
	breadcrumbs: []
};
