/* jshint ignore:start */

import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';

require('../styles/sidenav.scss');

export default React.createClass({
	render: render
});

function render() {
	return (
		<nav className="sidenav">
			<div className="container-fluid">
				<ul className="nav nav-pills nav-stacked">
					<li><Link to="/">Index</Link></li>
					<li><Link to="/toile">Toile</Link></li>
					<li><Link to="/codex">Codex</Link></li>
				</ul>
			</div>
		</nav>
	);
}
