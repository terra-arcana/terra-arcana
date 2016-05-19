import React from 'react';

import CharacterProfile from './character-profile.jsx';
import CharacterBuilder from './character-builder.jsx';
import CharacterSheet from './character-sheet.jsx';

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

		/**
		 * An dictionary of references to the tab switcher links
		 * @type {Object}
		 * @private
		 */
		this.tabLinks = {};

		this.fetchCharacterData = this.fetchCharacterData.bind(this);
		this.onTabButtonClick = this.onTabButtonClick.bind(this);
		this.onBuildChange = this.onBuildChange.bind(this);
	}

	/**
	 * @override
	 */
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
			<div className="text-center">
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
								<a href="#" onClick={this.onTabButtonClick} data-tab="profile">
									<span className="glyphicon glyphicon-user no-events" />
									<span className="no-events">&nbsp;Profil</span>
								</a>
							</li>
							<li
								ref = {(ref) => this.tabLinks['builder'] = ref}
								className = {(this.state.activeTab === 'builder') ? 'active' : ''}
							>
								<a href="#" onClick={this.onTabButtonClick} data-tab="builder">
									<span className="glyphicon glyphicon-th no-events" />
									<span className="no-events">&nbsp;Zodiaque</span>
								</a>
							</li>
							<li
								ref = {(ref) => this.tabLinks['sheet'] = ref}
								className = {(this.state.activeTab === 'sheet') ? 'active' : ''}
							>
								<a href="#" onClick={this.onTabButtonClick} data-tab="sheet">
									<span className="glyphicon glyphicon-file no-events" />
									<span className="no-events">&nbsp;Fiche</span>
								</a>
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
						onSuccessfulSave = {this.onBuildChange}
					/>
				);
				break;
			case 'sheet':
				tabContents = (
					<CharacterSheet />
				)
			}

			contents = (
				<div className="ta-character">
					<div className="ta-page-header row">
						<div className="col-xs-12">
							<div className="page-header">
								<h1>{this.state.character.title.rendered}</h1>
							</div>
						</div>
					</div>

					<div className="row">
						{nav}

						<div className="col-xs-12 ta-character-tab-content">
							<div className="row">
								{tabContents}
							</div>
						</div>
					</div>
				</div>
			);
		}

		return contents;
	}

	/**
	 * Grab active character data from the API
	 * @param {string} slug The active character slug
	 */
	fetchCharacterData(slug) {
		jQuery.get(WP_API_Settings.root + 'wp/v2/character?slug=' + slug, function(characterResponse) {
			// Fetch the character's people data
			jQuery.get(WP_API_Settings.root + 'wp/v2/people/' + characterResponse[0].people, function(peopleResponse) {

				// Enrich the people field in the character data
				characterResponse[0].people = {
					id: characterResponse[0].people,
					name: peopleResponse.title.rendered,
					singular: peopleResponse.singular
				};

				this.setState({
					character: characterResponse[0]
				});
			}.bind(this));
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

	/**
	 * React to character build changes
	 * @param {Array} build The character's new build
	 */
	onBuildChange(build) {
		var characterData = this.state.character;

		characterData['current_build'] = build;

		this.setState({
			character: characterData
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
