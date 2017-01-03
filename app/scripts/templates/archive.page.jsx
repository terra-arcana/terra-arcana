import React from 'react';
import {Link} from 'react-router';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';
import {stripLinkDomain} from '../utils/routered-text.jsx';

/**
 * An ArchivePage is a generic view for an archive of posts sorted by a taxonomy.
 * @class
 */
export default class ArchivePage extends React.Component {

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
		this.headerTitle = '';

		/**
		 * The breadcrumb data model for this page.
		 * @type {Array}
		 * @protected
		 */
		this.breadcrumbs = [];
	}

	/**
	 * Implement this in a subclass to populate state.contents with the posts.
	 * @abstract
 	 */
	componentDidMount() {}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var contents = <Spinner />;

		if (this.state.contents.length) {
			contents = this.state.contents.map(function(taxonomy) {
				return (
					<li key={taxonomy.id} className="ta-archive-taxonomy col-xs-12 col-md-6 col-lg-4">
						<h2>{taxonomy.name}
							<br />
							<small>{taxonomy.description}</small>
						</h2>
						<div className="list-group">
							{taxonomy.posts.map(function(post) {
								return (
									<Link
										key = {post.id}
										className = "list-group-item"
										to = {stripLinkDomain(post.link)}
									>
										<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
									</Link>
								);
							})}
						</div>
					</li>
				);
			}.bind(this));
		}

		return (
			<div className="ta-archive">
				<PageHeader
					content = {this.headerTitle}
					breadcrumbs= {this.breadcrumbs}
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
