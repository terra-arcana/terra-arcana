import React from 'react';

require('../../styles/codex/codex.scss');

/**
 * Codex archive component
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
		jQuery.get(WP_API_Settings.root + 'wp/v2/codex', function(result) {
			this.setState({
				codexArticles: result
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		let codexArticles = this.state.codexArticles.map(function(article) {
			return(
				<li key={article.id} className='panel panel-default'>
					<div className = 'panel-heading'>
						<h2 className = 'panel-title'>{article.title.rendered}</h2>
					</div>
					<div
						className = 'panel-body'
						dangerouslySetInnerHTML = {{__html: article.content.rendered}}
					></div>
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
