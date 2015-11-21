/* jshint ignore:start */

import React from 'react';
import Router from 'react-router';
import { Route, DefaultRoute, RouteHandler } from 'react-router';

import SideNav from './scripts/sidenav.jsx';
import Index from './scripts/index.jsx';
import Toile from './scripts/toile/toile.jsx';
import Codex from './scripts/codex/codex.jsx';

require('./styles/app.scss');

var App = React.createClass({
	render: function() {
		return (
			<div id="sidenav-page-wrapper" className="toggled">
				<SideNav />
				<div id="sidenav-content-wrapper">
					<h1>Terra Arcana</h1>
					<RouteHandler />
				</div>
			</div>
		)
	}
});

let routes = (
	<Route name="app" path="/" handler={App}>
		<DefaultRoute handler={Index} />
		<Route path="/toile" handler={Toile} />
		<Route path="/codex" handler={Codex} />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});
