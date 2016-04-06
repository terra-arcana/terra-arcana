import React from 'react';

import CharacterProfile from './character-profile.jsx';
import CharacterBuilder from './character-builder.jsx';

require('../../styles/character/character.page.scss');

/**
 * A CharacterPage is the main view for displaying a character's details.
 * @class
 */
export default class CharacterPage extends React.Component {

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
			character: undefined,
			activeTab: 'profile'
		};

		this.tabLinks = {};

		this.fetchCharacterData = this.fetchCharacterData.bind(this);
		this.onTabButtonClick = this.onTabButtonClick.bind(this);
	}

	componentDidMount() {
		this.fetchCharacterData(this.props.params.characterSlug);
	}

	/**
	 * @override
	 * @param {Object} nextProps
	 */
	componentWillReceiveProps(nextProps) {
		// Only update character if something changed
		if (nextProps.params.characterSlug !== this.props.params.characterSlug) {
			this.setState({
				character: undefined
			});

			this.fetchCharacterData(nextProps.params.characterSlug);
		}
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		// Show spinner by default
		var contents = (
			<div className="col-xs-12 text-center">
				<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
			</div>
		);

		if (this.state.character) {
			var nav = (
					<nav className="col-xs-12">
						<ul className="nav nav-tabs">
							<li
								ref = {(ref) => this.tabLinks['profile'] = ref}
								className = {(this.state.activeTab === 'profile') ? 'active' : ''}
							>
								<a href="#" onClick={this.onTabButtonClick} data-tab="profile">Profil</a>
							</li>
							<li
								ref = {(ref) => this.tabLinks['builder'] = ref}
								className = {(this.state.activeTab === 'builder') ? 'active' : ''}
							>
								<a href="#" onClick={this.onTabButtonClick} data-tab="builder">Zodiaque</a>
							</li>
						</ul>
					</nav>
				),
				tabContents = <noscript />;

			switch(this.state.activeTab) {
			case 'profile':
				tabContents = <CharacterProfile />;
				break;
			case 'builder':
				tabContents = (
					<CharacterBuilder
						character = {this.state.character}
					/>
				);
				break;
			}

			contents = (
				<div className="ta-character">
					<h1 className="col-xs-12">{this.state.character.title.rendered}</h1>
					{nav}

					<div className="col-xs-12 ta-character-tab-content">
						<div className="row">
							{tabContents}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="row">
				{contents}
			</div>
		);
	}

	/**
	 * Grab active character data from the API
	 * @param {string} slug The active character slug
	 */
	fetchCharacterData(slug) {
		jQuery.get(WP_API_Settings.root + 'wp/v2/character?slug=' + slug, function(response) {
			this.setState({
				character: response[0]
			});
		}.bind(this));
	}

	/**
	 * Handle tab navigation button clicks
	 * @param {MouseSyntheticEvent} e The event thrown
	 */
	onTabButtonClick(e) {
		var newActiveTab = e.target.dataset.tab;

		e.preventDefault();

		// Update tab active state
		jQuery(this.tabLinks[this.state.activeTab]).toggleClass('active');
		jQuery(this.tabLinks[newActiveTab]).toggleClass('active');

		this.setState({
			activeTab: newActiveTab
		});
	}
}

/**
 * @type {Object}
 */
CharacterPage.propTypes = {
	params: React.PropTypes.shape({
		characterSlug: React.PropTypes.string.isRequired
	}).isRequired
};
