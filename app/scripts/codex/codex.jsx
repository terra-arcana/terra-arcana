/* jshint ignore:start */

import React from 'react';

export default React.createClass({
	getInitialState: getInitialState,
	componentDidMount: componentDidMount,
	render: render
});

function getInitialState() {
	return({
		codexArticles: []
	});
}

function componentDidMount() {
	jQuery.ajax({
		url: appLocals.apiTerraPath + 'codex',
		type: 'get',
		dataType: 'JSON',
		success: function(data) {
			this.setState({
				codexArticles: data
			});
		}.bind(this)
	});
}

function render() {
	let codexArticles = this.state.codexArticles.map(function(article, index) {
		return(
			<li key={article.ID} className='thumbnail'>
				<div className='caption'>
					<h2>{article.post_title}</h2>
					<p className='entry-content'>{article.post_content}</p>
				</div>
			</li>
		)
	});

	return (
		<div>
			<h1>Codex</h1>
			<ul>
				{codexArticles}
			</ul>
		</div>
	);
}
