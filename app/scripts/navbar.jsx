/* jshint ignore:start */

import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';

export default React.createClass({
	render: render
});

function render() {
	return (
		<nav className="navbar navbar-default">
			<div className="container-fluid">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
				</div>
				<div id="navbar" className="navbar-collapse collapse">
					<ul className="nav navbar-bar">
						<li><Link to="/">Index</Link></li>
						<li><Link to="/toile">Toile</Link></li>
						<li><Link to="/codex">Codex</Link></li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
