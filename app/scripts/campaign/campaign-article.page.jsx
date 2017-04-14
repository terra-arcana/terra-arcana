import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';

import PageHeader from '../layout/page-header.jsx';
import RouteredText from '../utils/routered-text.jsx';
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
			breadcrumbs: [],
			events: []
		};

		this.fetchData = this.fetchData.bind(this);
		this.getLocationGoogleMap = this.getLocationGoogleMap.bind(this);
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
			breadcrumbs: [],
			events: []
		});

		jQuery.get(WP_API_Settings.root + 'wp/v2/campaign?slug=' + articleSlug, function(result) {
			if (result.length) {
				const article = result[0],
					breadcrumbs = [
						{
							uri: '/campagne/',
							caption: 'Campagnes'
						},
						{
							caption: article.title.rendered
						}
					];

				jQuery.get(WP_API_Settings.root + 'terraarcana/v1/campaign-events/' + article.id + '?order=asc', function(result) {
					this.setState({
						article: article,
						breadcrumbs: breadcrumbs,
						events: (result.length) ? result : []
					});
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

			var dates = null,
				location = null;

			if (this.state.events.length) {
				dates = (
					<div>
						<h2>Dates</h2>
						<div className="list-group">
							{this.state.events.map(function(event) {
								return (
									<div
										key = {event.id}
										className = "list-group-item"
										dangerouslySetInnerHTML = {{__html: 'du ' + event.date.start.rendered + ' au ' + event.date.end.rendered}}
									/>
								);
							})}
						</div>
					</div>
				);
			}

			if (this.state.article.location) {
				location = (
					<div>
						<h2>Adresse</h2>
						<a className="btn btn-primary btn-block" href={'https://www.google.ca/maps/place/' + this.state.article.location.address}>
							<span className="glyphicon glyphicon-map-marker" />&nbsp;
							{this.state.article.location.address}
						</a>
						{this.getLocationGoogleMap(this.state.article.location)}
					</div>
				);
			}

			content = (
				<div>
					<div className="col-xs-12 col-lg-8">
						<RouteredText text={this.state.article.content.rendered} />
					</div>
					<div className="col-xs-12 col-lg-4">
						{dates}
						{location}
					</div>
				</div>
			);
		}

		return (
			<div className="ta-article">
				<PageHeader
					content = {'<span>' + title + '</span> <small>' + subtitle + '</small>'}
					breadcrumbs = {this.state.breadcrumbs}
				/>
				<div className="ta-article-content ta-campaign-article-content container">
					<div className="row">
						{content}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Build the campaign's location Google Maps embed
	 * @param {Object} mapData The `address`, `lat` and `lng` of the campaign
	 * @return {DOM} The Google Maps embed
	 */
	getLocationGoogleMap(mapData) {
		const AsyncGoogleMap = withScriptjs(withGoogleMap(() => (
			<GoogleMap
				defaultZoom = {9}
				defaultCenter = {{ lat: parseFloat(mapData.lat), lng: parseFloat(mapData.lng) }}
				options = {{
					mapTypeControl: false,
					streetViewControl: false
				}}
			>
				<Marker
					position = {{ lat: parseFloat(mapData.lat), lng: parseFloat(mapData.lng) }}
				/>
			</GoogleMap>
		)));

		return (
			<AsyncGoogleMap
				googleMapURL = {'https://maps.googleapis.com/maps/api/js?key=' + WP_Theme_Settings.googleMapsAPIKey}
				loadingElement = {<Spinner />}
				containerElement = {<div />}
				mapElement = {<div className='ta-location-map' />}
			/>
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
