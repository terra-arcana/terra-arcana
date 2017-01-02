import ArticlePage from '../templates/article.page.jsx';

/**
 * A RulesArticlePage is the view for a single rules article.
 * @class
 */
export default class RulesArticlePage extends ArticlePage {

	/**
	 * @override
	 */
	fetchTaxonomy(articleSlug) {
		this.setState({
			article: null,
			taxonomies: []
		});

		jQuery.get(WP_API_Settings.root + 'wp/v2/rules?slug=' + articleSlug, function(result) {
			if (result.length) {
				var article = result[0];

				jQuery.get(WP_API_Settings.root + 'wp/v2/rule-sections', function(sections) {
					var articleSections = [];

					if (sections.length) {
						article['rule-sections'].map(function(articleSectionId) {
							sections.map(function(chapter) {
								if (articleSectionId === chapter.id) {
									articleSections.push(chapter);
								}
							}.bind(this));
						}.bind(this));
					}

					this.setState({
						article: article,
						taxonomies: articleSections
					});
				}.bind(this));
			}
		}.bind(this));
	}
}
