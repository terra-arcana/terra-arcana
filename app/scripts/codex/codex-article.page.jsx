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
			taxonomies: [],
			breadcrumbs: []
		});

		jQuery.get(WP_API_Settings.root + 'wp/v2/codex?slug=' + articleSlug, function(result) {
			if (result.length) {
				const article = result[0],
					breadcrumbs = [
						{
							uri: '/codex',
							caption: 'Codex Arcanum'
						},
						{
							caption: article.title.rendered
						}
					];

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
						taxonomies: articleChapters,
						breadcrumbs: breadcrumbs
					});
				}.bind(this));
			}
		}.bind(this));
	}
}
