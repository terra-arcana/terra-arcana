import React from 'react';

require('../../styles/layout/page-header.scss');

export default class PageHeader extends React.Component {
	render() {
		return (
			<div className="ta-page-header">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
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
	content: React.PropTypes.string
};
