import React from 'react';

require('../../styles/codex/codex.scss');

var codex = {};

/* Methods */

/**
 * Set the initial state
 * 
 * @return {Object} The initial state
 */
codex.getInitialState = function() {
	return({
		codexArticles: []
	});
};

/**
 * Initialize the component after mounting
 */
codex.componentDidMount = function() {
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
};

/**
 * Render the codex component
 * 
 * @return {jsx} The component template
 */
codex.render = function() {
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
};

/* Export */

export default React.createClass(codex);
