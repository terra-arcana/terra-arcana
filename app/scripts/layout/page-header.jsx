import React from 'react';

require('../../styles/layout/page-header.scss');

export default class PageHeader extends React.Component {
	render() {
		var contentClasses = (this.props.articleMode)
			? 'col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'
			: 'col-xs-12';

		return (
			<div className="ta-page-header">
				<div className="container">
					<div className="row">
						<div className={contentClasses}>
							<h1
								className = "page-header"
								dangerouslySetInnerHTML = {{__html: this.props.content }}>
							</h1>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PageHeader.propTypes = {
	articleMode: React.PropTypes.bool,
	content: React.PropTypes.string
};
