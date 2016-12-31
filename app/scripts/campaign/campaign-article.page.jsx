import React from 'react';
import RouteredText from '../utils/routered-text.jsx';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';

require('../../styles/templates/article.scss');
require('../../styles/campaign/campaign-article.scss');

/**
 * A CampaignArticlePage is the view for a single campaign post, along with all
 * child event posts.
 * @class
 */
export default class CampaignArticlePage extends React.Component {

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
			events: []
		};

		this.fetchData = this.fetchData.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		this.fetchData(this.props.params.articleSlug);
	}

	/**
	 * @override
	 */
	componentWillReceiveProps(nextProps) {
		this.fetchData(nextProps.params.articleSlug);
	}

	/**
	 * @private
	 */
	fetchData(articleSlug) {
		this.setState({
			article: null,
			events: []
		});

		jQuery.get(WP_API_Settings.root + 'wp/v2/campaign?slug=' + articleSlug, function(result) {
			if (result.length) {
				var article = result[0];
				// TODO: Fetch and set events. They should be available through the campaign API.

				this.setState({
					article: article,
				});
			}
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var content = <Spinner />,
			title = '&nbsp',
			subtitle = '';

		if (this.state.article) {
			title = this.state.article.title.rendered;
			subtitle = this.state.article.subtitle;
			content = (
				<div className="col-xs-12 col-lg-8">
					<RouteredText text={this.state.article.content.rendered} />
				</div>
			);
		}

		return (
			<div className="ta-article">
				<PageHeader
					content = {'<span>' + title + '</span> <small>' + subtitle + '</small>'}
				/>
				<div className="ta-article-content ta-campaign-article-content container">
					<div className="row">
						{content}
					</div>
				</div>
			</div>
		);
	}
}

/**
 * @type {Object}
 */
CampaignArticlePage.propTypes = {
	params: React.PropTypes.shape({
		articleSlug: React.PropTypes.string.isRequired
	}).isRequired
};
