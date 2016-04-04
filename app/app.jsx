import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import {Route, DefaultRoute, RouteHandler} from 'react-router';

import Sidenav from './scripts/sidenav.jsx';
import Index from './scripts/index.jsx';
import CharacterBuilder from './scripts/zodiac/character-builder.jsx';
import Codex from './scripts/codex/codex.jsx';

require('./styles/app.scss');

/**
 * An App is the main application wrapper. It is the single most top-level React component.
 * @class
 */
class App extends React.Component {

	/**
	 * @constructor
	 * @param {Object} Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			currentUser: undefined
		};
	}

	componentDidMount() {
		jQuery.ajax({
			url: WP_API_Settings.root + 'wp/v2/users/me',
			method: 'GET',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);
			},
			statusCode: {
				401: function() {
					this.setState({
						currentUser: null
					});
				}.bind(this)
			},
			success: function(response) {
				this.setState({
					currentUser: response
				})
			}.bind(this)
		});
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div id="sidenav-page-wrapper" className="toggled">
				<Sidenav
					currentUser = {this.state.currentUser}
				/>
				<div id="sidenav-content-wrapper" className="container-fluid">
					<div className="row">
						<h1 className="col-xs-12">Terra Arcana</h1>
					</div>
					<RouteHandler />
				</div>
			</div>
		);
	}
}

let routes = (
	<Route name="app" path="/" handler={App}>
		<DefaultRoute handler={Index} />
		<Route path="/codex" handler={Codex} />
		<Route path="/zodiaque" handler={CharacterBuilder} />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	ReactDOM.render(<Handler/>, document.getElementById('main'));
});
