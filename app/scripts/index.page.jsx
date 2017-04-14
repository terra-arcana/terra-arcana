import React from 'react';
import {Link} from 'react-router';
import Lodash from 'lodash';

import {CenteredSpinner} from './layout/spinner.jsx';

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
			campaign: {},
			campaignNextEvent: {},
			homeContent: {},
			posts: []
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var postsData = [],
			campaignData = {},
			campaignNextEventData = {},
			homeContentData = {},

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
			},

			homeContentRequest = () => {
				let deferred = jQuery.Deferred();

				jQuery.get(WP_API_Settings.root + 'terraarcana/v1/pages', result => {
					jQuery.get(WP_API_Settings.root + 'wp/v2/pages/' + result.home, result => {
						homeContentData = result.content.rendered;
						deferred.resolve();
					});
				});

				return deferred.promise();
			},

			newsRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/posts?per_page=3', result => {
				postsData = result;
			});

		jQuery.when(newsRequest, campaignRequest(), homeContentRequest()).done(() => {
			this.setState({
				campaign: campaignData,
				campaignNextEvent: campaignNextEventData,
				homeContent: homeContentData,
				posts: postsData
			});
		});
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var banner = null,
			content = <CenteredSpinner />;

		if (!Lodash.isEmpty(this.state.campaign) && !Lodash.isEmpty(this.state.campaignNextEvent)) {
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

		if (this.state.posts.length && !Lodash.isEmpty(this.state.homeContent)) {
			content = (
				<div className="ta-index-content container">
					<div className="row">
						<div
							className = "col-xs-12 col-lg-8"
							dangerouslySetInnerHTML = {{__html: this.state.homeContent}}
						/>
						<div className="col-xs-12 col-lg-4">
							<a className="well ta-discord-panel" href="https://discord.gg/DskSMeC" target="_blank">
								<img src="https://discordapp.com/assets/e05ead6e6ebc08df9291738d0aa6986d.png" />
								Vous avez des <strong>questions</strong>? Des <strong>commentaires</strong>? Vous voulez <strong>faire du RP</strong> avec la communauté?
								Rejoignez notre serveur Discord!
							</a>

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
