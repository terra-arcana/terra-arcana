import React from 'react';
import {Link} from 'react-router';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';
import {stripLinkDomain} from '../utils/routered-text.jsx';

require('../../styles/campaign/campaign-archive.scss');

/**
 * An ArchivePage is a generic view for an archive of posts sorted by a taxonomy.
 * @class
 */
export default class CampaignArchivePage extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @protected
		 */
		this.state = {
			contents: []
		};

		/**
		 * The text to render in the header. Override this in subclasses.
		 * @type {String}
		 * @protected
		 */
		this.headerTitle = 'Campagnes';

		/**
		 * The breadcrumb data model for this page.
		 * @type {Array}
		 */
		this.breadcrumbs = [{ caption: 'Campagnes' }];
	}

	/**
	 * Implement this in a subclass to populate state.contents with the posts.
	 * @abstract
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/campaign?per_page=100', function(posts) {
			this.setState({
				contents: posts
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var contents = <Spinner />;

		if (this.state.contents.length) {
			contents = this.state.contents.map(function(post) {
				return (
					<li key={post.id} className="ta-archive-campaign col-xs-12 col-md-6">
						<h2>
							<Link to={stripLinkDomain(post.link)}>
								<img src={post.banner.url} alt={post.title.rendered} title={post.title.rendered} />
							</Link>
						</h2>
					</li>
				);
			}.bind(this));
		}

		return (
			<div className="ta-archive">
				<PageHeader
					content = {this.headerTitle}
					breadcrumbs = {this.breadcrumbs}
				/>
				<div className="container">
					<ul className="row list-unstyled">
						{contents}
					</ul>
				</div>
			</div>
		);
	}
}
