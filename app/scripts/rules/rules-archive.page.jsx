import ArchivePage from '../templates/archive.page.jsx';

/**
 * A RulesArchivePage is the root view for listing all rule entries, sorted by chapters.
 * @class
 */
export default class RulesArchivePage extends ArchivePage {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @override
		 */
		this.headerTitle = 'Système de jeu <small>Le registre officiel des règles de jeu de Terra Arcana</small>';

		/**
		 * @override
		 */
		this.breadcrumbs = [{ caption: 'Système de jeu' }];
	}

	/**
	 * @override
 	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/rule-sections', function(taxonomies) {
			taxonomies.map(function(taxonomy) {
				taxonomy.posts = [];
			}.bind(this));

			jQuery.get(WP_API_Settings.root + 'wp/v2/rules', function(articles) {
				// Sort all articles in their respective chapter
				articles.map(function(article) {
					article['rule-sections'].map(function(articleSection) {
						taxonomies.map(function(taxonomy) {
							if (taxonomy.id === articleSection) {
								taxonomy.posts.push(article);
								return;
							}
						}.bind(this));
					}.bind(this));
				}.bind(this));

				this.setState({
					contents: taxonomies
				});
			}.bind(this));
		}.bind(this));
	}
}
