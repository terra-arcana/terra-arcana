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
				jQuery.get(WP_API_Settings.root + 'terraarcana/v1/campaign-events/' + article.id + '?order=asc', function(result) {
					if (result.length) {
						this.setState({
							article: article,
							events: result
						});
					}
				}.bind(this));
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
				<div>
					<div className="col-xs-12 col-lg-8">
						<RouteredText text={this.state.article.content.rendered} />
					</div>
					<div className="col-xs-12 col-lg-4">
						<h2>Dates</h2>
						<div className="list-group">
							{this.state.events.map(function(event) {
								return (
									<div
										key = {event.id}
										className = "list-group-item"
										dangerouslySetInnerHTML = {{__html: 'du ' + event.date[0].start + ' au ' + event.date[0].end}}
									/>
								);
							})}
						</div>
					</div>
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
