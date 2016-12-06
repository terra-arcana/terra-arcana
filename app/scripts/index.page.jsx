import React from 'react';

import PageHeader from './layout/page-header.jsx';
import Spinner from './layout/spinner.jsx';

/**
 * An IndexPage is the main view for displaying the homepage.
 * @class
 */
export default class IndexPage extends React.Component {

	/**
	 * @constructor
	 * @param {props} Initial props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			posts: []
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/posts', function(result) {
			this.setState({
				posts: result
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var content = <Spinner />;

		if (this.state.posts.length) {
			content = (
				<div className="ta-index-content container">
					{this.state.posts.map(function(post) {
						return (
							<div key={post.id} className="ta-post">
								<div className="page-header">
									<h2>{post.title.rendered}</h2>
								</div>

								<div
									className = "ta-post-content"
									dangerouslySetInnerHTML = {{__html: post.content.rendered}}
								/>
							</div>
						);
					}.bind(this))}
				</div>
			);
		}

		return (
			<div className="ta-home">
				<PageHeader
					content = "<h1>Terra Arcana <small>Grandeur Nature médiéval fantastique</small></h1>"
				/>
				{content}
			</div>
		);
	}
}
