import React from 'react';
import {Link} from 'react-router';

import PageHeader from './layout/page-header.jsx';
import Spinner from './layout/spinner.jsx';

require('../styles/index.scss');

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
			posts: [],
			campaign: null,
			campaignNextEvent: null
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var postsData = [],
			campaignData = {},
			campaignNextEventData = {},

			newsRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/posts?per_page=3', result => {
				postsData = result;
			}),

			campaignRequest = () => {
				let deferred = jQuery.Deferred();

				jQuery.get(WP_API_Settings.root + 'wp/v2/campaign?per_page=1', result => {
					campaignData = result[0];

					// TODO: Handle next campaign event
					jQuery.get(WP_API_Settings.root + 'terraarcana/v1/campaign-events/' + campaignData.id, result => {
						campaignNextEventData = result[0];
						deferred.resolve();
					});
				});

				return deferred.promise();
			};

		jQuery.when(newsRequest, campaignRequest()).done(() => {
			this.setState({
				posts: postsData,
				campaign: campaignData,
				campaignNextEvent: campaignNextEventData
			});
		});
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var banner = null,
			content = <Spinner />;

		if (this.state.campaign !== null && this.state.campaignNextEvent !== null) {
			let date = this.state.campaignNextEvent.date;

			banner = (
				<div className="col-xs-12">
					<Link to={this.state.campaign.link}>
						<div className="ta-campaign-banner-hover-text text-center">
							<div>
								Prochaine campagne
								<h2>{this.state.campaign.title.rendered}</h2>
								du {date.start.rendered} au {date.end.rendered}
							</div>
						</div>
						<img src={this.state.campaign.banner.url} alt={this.state.campaign.title.rendered} />
					</Link>
				</div>
			);
		}

		if (this.state.posts.length) {
			content = (
				<div className="ta-index-content container">
					<div className="row">
						<div className="col-xs-12 col-lg-8">
							À venir
						</div>

						<div className="col-xs-12 col-lg-4">
							<h2>Actualités</h2>
							<ul className="list-unstyled">
								{this.state.posts.map(function(post) {
									return (
										<li
											key = {post.id}
											className = "panel panel-default"
											>
											<div className="panel-heading">
												<h3 className="panel-title">{post.title.rendered}</h3>
											</div>
											<div
												className = "panel-body"
												dangerouslySetInnerHTML = {{__html: post.content.rendered}}
												/>
										</li>
									);
								}.bind(this))}
							</ul>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="ta-home">
				<PageHeader
					content = "Terra Arcana <small>Grandeur Nature médiéval fantastique</small>"
				/>
				<div className="ta-campaign-background">
					<div className="container">
						<div className="row">
							{banner}
						</div>
					</div>
				</div>
				{content}
			</div>
		);
	}
}
