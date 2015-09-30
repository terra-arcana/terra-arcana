/* jshint ignore:start */

import React from 'react';
import Router from 'react-router';
import { Route, DefaultRoute, RouteHandler } from 'react-router';

import Navbar from './scripts/navbar.jsx';
import Index from './scripts/index.jsx';
import Toile from './scripts/toile/toile.jsx';

require('./styles/app.scss');

var App = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Terra Arcana</h1>
                <Navbar />
                <RouteHandler />
            </div>
        )
    }
});

let routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Index} />
        <Route path="/toile" handler={Toile} />
    </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});
