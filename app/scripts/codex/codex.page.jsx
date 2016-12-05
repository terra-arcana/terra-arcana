import React from 'react';
import {Link} from 'react-router';

import PageHeader from '../layout/page-header.jsx';

require('../../styles/codex/codex.scss');

/**
 * A CodexPage is the root view for listing all Codex entries, sorted by chapters.
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
			codexContents: []
		};
	}

	/**
	 * @override
 	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/chapters', function(chapters) {
			chapters.map(function(chapter) {
				chapter.articles = [];
			}.bind(this));

			jQuery.get(WP_API_Settings.root + 'wp/v2/codex', function(articles) {
				// Sort all articles in their respective chapter
				articles.map(function(article) {
					article.chapters.map(function(articleChapter) {
						chapters.map(function(chapter) {
							if (chapter.id === articleChapter) {
								chapter.articles.push(article);
								return;
							}
						}.bind(this));
					}.bind(this));
				}.bind(this));

				this.setState({
					codexContents: chapters
				});
			}.bind(this));
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		let codexContents = (
			<div className="text-center">
				<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
			</div>
		);

		if (this.state.codexContents.length) {
			codexContents = this.state.codexContents.map(function(chapter) {
				return (
					<li key={chapter.id} className="ta-codex-chapter col-xs-12 col-md-6 col-lg-4">
						<h2>{chapter.name}
							<br />
							<small>{chapter.description}</small>
						</h2>
						<ul className="list-group">
							{chapter.articles.map(function(article) {
								return (
									<li key={article.id} className="panel panel-default">
										<div className="panel-heading">
											<Link to={article.link}>
												<h3 className="panel-title">{article.title.rendered}</h3>
											</Link>
										</div>
										<div
											className="panel-body"
											dangerouslySetInnerHTML= {{__html: article.excerpt.rendered}}
										/>
									</li>
								);
							}.bind(this))}
						</ul>
					</li>
				);
			});
		}

		return (
			<div className="ta-codex-archive">
				<PageHeader content="Codex Arcanum <small>Le recensement de l'histoire de Raffin et d'Atropos</small>" />
				<div className="container">
					<ul className="row list-unstyled">
						{codexContents}
					</ul>
				</div>
			</div>
		);
	}
}
