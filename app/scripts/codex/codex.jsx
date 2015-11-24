import React from 'react';

require('../../styles/codex/codex.scss');

/**
 * Codex archive component
 * 
 * @class
 */
export default class Codex extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = { 
			codexArticles: []
		};
	}

	/**
	 * @override
 	 */
	componentDidMount() {
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

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		let codexArticles = this.state.codexArticles.map(function(article) {
			return(
				<li key={article.ID} className='panel panel-default'>
					<div className='panel-heading'>
						<h2 className='panel-title'>{article.post_title}</h2>
					</div>
					<div className='panel-body'>
						{article.post_content}
					</div>
				</li>
			);
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
}
