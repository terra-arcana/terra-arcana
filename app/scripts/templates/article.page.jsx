import React from 'react';
import RouteredText from '../utils/routered-text.jsx';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';

require('../../styles/templates/article.scss');

/**
 * An ArticlePage is a generic view for a single WordPress post.
 * @class
 */
export default class ArticlePage extends React.Component {

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
			article: null,
			taxonomies: []
		};

		this.fetchTaxonomy = this.fetchTaxonomy.bind(this);
		this.getTaxonomyList = this.getTaxonomyList.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		this.fetchTaxonomy(this.props.params.articleSlug);
	}

	/**
	 * @override
	 */
	componentWillReceiveProps(nextProps) {
		this.fetchTaxonomy(nextProps.params.articleSlug);
	}

	/**
	 * Implement this in a subclass to fetch the taxonomy information for this post.
	 * @abstract
	 * @protected
	 */
	fetchTaxonomy() {}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var content = <Spinner />,
			title = '&nbsp';

		if (this.state.article) {
			title = this.state.article.title.rendered;
			content = (
				<div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
					<RouteredText text={this.state.article.content.rendered} />
				</div>
			);
		}

		return (
			<div className="ta-article">
				<PageHeader
					articleMode = {true}
					content = {'<span>' + title + '</span> <small>' + this.getTaxonomyList(this.state.taxonomies) + '</small>'}
				/>
				<div className="ta-article-content container">
					<div className="row">
						{content}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Get all chapters of the article separated by commas
	 * @private
	 * @param {Array} taxonomies The chapter data from the article
	 * @return {string}
	 */
	getTaxonomyList(taxonomies) {
		var taxonomyNames = [];

		taxonomies.map(function(taxonomy) {
			taxonomyNames.push(taxonomy.name);
		}.bind(this));

		return taxonomyNames.join(', ');
	}
}

/**
 * @type {Object}
 */
ArticlePage.propTypes = {
	params: React.PropTypes.shape({
		articleSlug: React.PropTypes.string.isRequired
	}).isRequired
};
