/* jshint ignore:start */

import React from 'react';

require('../../styles/codex/codex.scss');

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
			<li key={article.ID} className='panel panel-default'>
				<div className='panel-heading'>
					<h2 className='panel-title'>{article.post_title}</h2>
				</div>
				<div className='panel-body'>
					{article.post_content}
				</div>
			</li>
		)
	});

	return (
		<div className='codex-archive'>
			<h1>Codex</h1>
			<ul>
				{codexArticles}
			</ul>
		</div>
	);
}
