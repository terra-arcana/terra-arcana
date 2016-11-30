import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Lodash from 'lodash';

import Navbar from './scripts/layout/navbar.jsx';
import Footer from './scripts/layout/footer.jsx';
import IndexPage from './scripts/index.page.jsx';
import CharacterPage from './scripts/character/character.page.jsx';
import CharacterNewPage from './scripts/character/character-new.page.jsx';
import ZodiacViewerPage from './scripts/zodiac/zodiac-viewer.page.jsx';
import CodexPage from './scripts/codex/codex.page.jsx';
import CodexArticlePage from './scripts/codex/codex-article.page.jsx';

require('./styles/app.scss');

/**
 * An App is the main application wrapper. It is the single most top-level React component.
 * @class
 */
class App extends React.Component {

	/**
	 * @constructor
	 * @param {Object} Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			currentUser: undefined
		};

		this.switchActiveCharacter = this.switchActiveCharacter.bind(this);
	}

	componentDidMount() {
		jQuery.ajax({
			url: WP_API_Settings.root + 'wp/v2/users/me',
			method: 'GET',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);
			},
			statusCode: {
				401: function() {
					this.setState({
						currentUser: null
					});
				}.bind(this)
			},
			success: function(response) {
				this.setState({
					currentUser: response
				});
			}.bind(this)
		});
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<div>
				<Navbar
					currentUser = {this.state.currentUser}
					onSwitchActiveCharacter = {this.switchActiveCharacter}
				/>
				{React.cloneElement(this.props.children, {
					onSwitchActiveCharacter: this.switchActiveCharacter
				})}
				<Footer />
			</div>
		);
	}

	/**
	 * Changes the current user's active character to a new one.
	 * @param {number} id The new active character's ID
	 * @param {bool} [sendServerUpdate=true] Notify the back-end that the current user changed
	 */
	switchActiveCharacter(id, sendServerUpdate=true) {
		var currentUser = Lodash.cloneDeep(this.state.currentUser);

		currentUser['active_character'] = id;

		this.setState({
			currentUser: currentUser
		});

		// Update WordPress user model
		if (sendServerUpdate) {
			jQuery.ajax({
				url: WP_API_Settings.root + 'wp/v2/users/' + currentUser['id'],
				method: 'POST',
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);
				},
				data: {
					'active_character': id
				}
			});
		}
	}
}

/**
 * @type {Object}
 */
App.propTypes = {
	children: React.PropTypes.element
};

ReactDOM.render(
	<Router history={browserHistory} >
		<Route path="/" component={App}>
			<IndexRoute component={IndexPage} />
			<Route path="/codex/" component={CodexPage} />
			<Route path="/codex/:articleSlug/" component={CodexArticlePage} />
			<Route path="/zodiaque/" component={ZodiacViewerPage} />
			<Route path="/personnage/creer/" component={CharacterNewPage} />
			<Route path="/personnage/:characterSlug/" component={CharacterPage} />
			// TODO: Find a way to default these to particular tabs. See #162
			<Route path="/personnage/:characterSlug/zodiaque/" component={CharacterPage} />
			<Route path="/personnage/:characterSlug/fiche/" component={CharacterPage} />
		</Route>
	</Router>,
	document.getElementById('main')
);
