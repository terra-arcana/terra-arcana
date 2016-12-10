import React from 'react';

import PageHeader from '../layout/page-header.jsx';
import Spinner from '../layout/spinner.jsx';

require('../../styles/codex/codex-article.scss');

/**
 * A CodexArticlePage is the view for a single Codex article.
 * @class
 */
export default class CodexArticlePage extends React.Component {

	/**
	 * @constructor
	 * @param {props} Initial props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			article: null,
			chapters: []
		};

		this.getChapterList = this.getChapterList.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/codex?slug=' + this.props.params.articleSlug, function(result) {
			if (result.length) {
				var article = result[0];

				jQuery.get(WP_API_Settings.root + 'wp/v2/chapters', function(chapters) {
					var articleChapters = [];

					if (chapters.length) {
						article.chapters.map(function(articleChapterId) {
							chapters.map(function(chapter) {
								if (articleChapterId === chapter.id) {
									articleChapters.push(chapter);
								}
							}.bind(this));
						}.bind(this));
					}

					this.setState({
						article: article,
						chapters: articleChapters
					});
				}.bind(this));
			}
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var content = <Spinner />,
			title = '&nbsp';

		if (this.state.article) {
			title = this.state.article.title.rendered;
			content = (
				<div
					className = "col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2"
					dangerouslySetInnerHTML = {{__html: this.state.article.content.rendered}}
				/>
			);
		}

		return (
			<div className="ta-codex-article">
				<PageHeader
					articleMode = {true}
					content = {'<span>' + title + '</span> <small>' + this.getChapterList(this.state.chapters) + '</small>'}
				/>
			<div className="ta-codex-article-content container">
					<div className="row">
						{content}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Get all chapters of the article separated by commas
	 * @param {Array} chapters The chapter data from the article
	 * @return {string}
	 */
	getChapterList(chapters) {
		var chapterNames = [];

		chapters.map(function(chapter) {
			chapterNames.push(chapter.name);
		}.bind(this));

		return chapterNames.join(', ');
	}
}

/**
 * @type {Object}
 */
CodexArticlePage.propTypes = {
	params: React.PropTypes.shape({
		articleSlug: React.PropTypes.string.isRequired
	}).isRequired
};
