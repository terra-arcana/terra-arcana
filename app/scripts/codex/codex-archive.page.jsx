import ArchivePage from '../templates/archive.page.jsx';

/**
 * A CodexPage is the root view for listing all Codex entries, sorted by chapters.
 * @class
 */
export default class CodexArchivePage extends ArchivePage {

	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @override
		 */
		this.headerTitle = 'Codex Arcanum <small>Le recensement de l\'histoire de Raffin et d\'Atropos</small>';
	}

	/**
	 * @override
 	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/chapters?per_page=100', function(taxonomies) {
			taxonomies.map(function(taxonomy) {
				taxonomy.posts = [];
			}.bind(this));

			// TODO: batch all requests once we hit 101+ codex articles :/
			jQuery.get(WP_API_Settings.root + 'wp/v2/codex?per_page=100', function(articles) {
				// Sort all articles in their respective chapter
				articles.map(function(article) {
					article.chapters.map(function(articleChapter) {
						taxonomies.map(function(taxonomy) {
							if (taxonomy.id === articleChapter) {
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
