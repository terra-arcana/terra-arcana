import React from 'react';
import {Link, IndexLink} from 'react-router';

require('../../styles/layout/breadcrumbs.scss');
require('../../images/breadcrumbs-home.png');

export default class Breadcrumbs extends React.Component {
	render() {
		return (
			<ol className = 'breadcrumb ta-breadcrumbs'>
				<li>
					<IndexLink to="/">
						<img src={WP_Theme_Settings.imageRoot + 'breadcrumbs-home.png'} />
					</IndexLink>
				</li>
				{this.props.links.map(function(link, index) {
					return ((link.uri)
						? <li key={index}>
								<Link to={link.uri}>{link.caption}</Link>
							</li>
						: <li className="active">{link.caption}</li>
					);
				})}
			</ol>
		);
	}
}

/**
 * @type {Object}
 */
Breadcrumbs.propTypes = {
	links: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			uri: React.PropTypes.string,
			caption: React.PropTypes.string.isRequired
		})
	).isRequired
};
