import ArticlePage from '../templates/article.page.jsx';

/**
 * A CodexArticlePage is the view for a single Codex article.
 * @class
 */
export default class CodexArticlePage extends ArticlePage {

	/**
	 * @override
	 */
	fetchTaxonomy(articleSlug) {
		this.setState({
			article: null,
			taxonomies: []
		});

		jQuery.get(WP_API_Settings.root + 'wp/v2/codex?slug=' + articleSlug, function(result) {
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
						taxonomies: articleChapters
					});
				}.bind(this));
			}
		}.bind(this));
	}
}
