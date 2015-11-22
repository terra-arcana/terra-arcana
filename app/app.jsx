/* jshint ignore:start */

import React from 'react';
import Router from 'react-router';
import { Route, DefaultRoute, RouteHandler } from 'react-router';

import Sidenav from './scripts/sidenav.jsx';
import Index from './scripts/index.jsx';
import CharacterBuilder from './scripts/character-builder.jsx';
import Codex from './scripts/codex/codex.jsx';

require('./styles/app.scss');

var App = React.createClass({
	render: function() {
		return (
			<div id="sidenav-page-wrapper" className="toggled">
				<Sidenav />
				<div id="sidenav-content-wrapper" className="container-fluid">
					<div className="row">
						<h1 className="col-xs-12">Terra Arcana</h1>
					</div>
					<RouteHandler />
				</div>
			</div>
		)
	}
});

let routes = (
	<Route name="app" path="/" handler={App}>
		<DefaultRoute handler={Index} />
		<Route path="/competences" handler={CharacterBuilder} />
		<Route path="/codex" handler={Codex} />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});
