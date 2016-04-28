import React from 'react';

require('../../styles/codex/codex.scss');

/**
 * A CodexPage is the main view for listing all Codex entries
 * @class
 */
export default class CodexPage extends React.Component {

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
				<li key={article.id} className="panel panel-default">
					<div className="panel-heading">
						<h2 className="panel-title">{article.title.rendered}</h2>
					</div>
					<div
						className="panel-body"
						dangerouslySetInnerHTML = {{__html: article.content.rendered}}
					></div>
				</li>
			);
		});

		return (
			<div className="ta-codex-archive">
				<div className="ta-page-header row">
					<div className="col-xs-12">
						<div className="page-header">
							<h1>Codex Arcanum</h1>
						</div>
					</div>
				</div>

				<div className="alert alert-warning">Bientôt disponible!</div>

				<ul>
					{codexArticles}
				</ul>
			</div>
		);
	}
}
