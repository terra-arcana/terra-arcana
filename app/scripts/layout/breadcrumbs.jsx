import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

require('../../styles/layout/breadcrumbs.scss');
require('../../images/breadcrumbs-home.png');

export default class Breadcrumbs extends React.Component {
	render() {
		return (
			<ol className = 'breadcrumb ta-breadcrumbs'>
				<li>
					<Link to="/">
						<img src={WP_Theme_Settings.imageRoot + 'breadcrumbs-home.png'} />
					</Link>
				</li>
				{this.props.links.map(function(link, index) {
					return ((link.uri)
						? <li key={index}>
								<Link to={link.uri}>{link.caption}</Link>
							</li>
						: <li key={index} className="active">
								{link.caption}
							</li>
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
	links: PropTypes.arrayOf(
		PropTypes.shape({
			uri: PropTypes.string,
			caption: PropTypes.string.isRequired
		})
	).isRequired
};
