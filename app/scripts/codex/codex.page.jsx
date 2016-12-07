import React from 'react';
import {Link} from 'react-router';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';

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
		jQuery.get(WP_API_Settings.root + 'wp/v2/chapters?per_page=100', function(chapters) {
			chapters.map(function(chapter) {
				chapter.articles = [];
			}.bind(this));

			// TODO: batch all requests once we hit 101+ codex articles :/
			jQuery.get(WP_API_Settings.root + 'wp/v2/codex?per_page=100', function(articles) {
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
		var codexContents = <Spinner />;

		if (this.state.codexContents.length) {
			codexContents = this.state.codexContents.map(function(chapter) {
				return (
					<li key={chapter.id} className="ta-codex-chapter col-xs-12 col-md-6 col-lg-4">
						<h2>{chapter.name}
							<br />
							<small>{chapter.description}</small>
						</h2>
						<div className="list-group">
							{chapter.articles.map(function(article) {
								return (
									<Link
										key = {article.id}
										className = "list-group-item"
										to = {article.link}>
										<h3
											className = "panel-title"
											dangerouslySetInnerHTML = {{__html: article.title.rendered }}
										/>
									</Link>
								);
							})}
						</div>
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
