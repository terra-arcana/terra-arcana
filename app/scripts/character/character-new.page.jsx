import React from 'react';
import {Link} from 'react-router';
import Lodash from 'lodash';

import Spinner from '../layout/spinner.jsx';

/**
 * The CharacterNewPage is the page where users can create new characters for
 * their account.
 * @class
 */
export default class CharacterNewPage extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Initial props
	 */
	constructor(props) {
		super(props);

		this.onNameChange = this.onNameChange.bind(this);
		this.onPeopleChange = this.onPeopleChange.bind(this);
		this.onStartingSkillChange = this.onStartingSkillChange.bind(this);
		this.createCharacter = this.createCharacter.bind(this);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			character: {
				name: '',
				people: null,
				startingSkill: null
			},
			peoples: [],
			startingSkills: [],
			alert: null
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var peoples = [],
			startingSkills = [],

			peopleRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/people?filter[meta_key]=playable&filter[meta_value]=1', function(result) {
				peoples = result;
			}.bind(this)),

			startingSkillRequest = jQuery.get(WP_API_Settings.root + 'terraarcana/v1/starting-skills', function(result) {
				startingSkills = result;
			}.bind(this));

		jQuery.when(peopleRequest, startingSkillRequest).done(function() {
			this.setState({
				peoples: peoples,
				startingSkills: startingSkills
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {HTML} The component template
	 */
	render() {
		var content = <Spinner />,
			alert = <noscript />;

		if (this.state.alert !== null) {
			var alertClass, iconClass;

			if (this.state.alert.type === 'error') {
				alertClass = 'text-danger';
				iconClass = 'glyphicon-exclamation-sign';
			} else if (this.state.alert.type === 'saving') {
				alertClass = 'text-info';
				iconClass = 'glyphicon-asterisk glyphicon-spin';
			} else if (this.state.alert.type === 'saved') {
				alertClass = 'text-success';
				iconClass = 'glyphicon-ok';
			}

			alert = (
				<span className={'ta-button-alert ' + alertClass}>
					<span className={'glyphicon ' + iconClass} />&nbsp;
					{this.state.alert.message}
				</span>
			);
		}

		if (this.state.peoples.length > 0) {
			content = (
				<div className="ta-character-new">
					<h1>Créer un nouveau personnage</h1>

					<form>
						<div className="form-group">
							<label htmlFor="characterName">Nom du personnage</label>
							<input
								id = "characterName"
								type = "text"
								className = "form-control"
								value = {this.state.characterName}
								onChange = {this.onNameChange}
							/>
						</div>

						<div className="form-group panel-group">
							<label>Peuple</label>
							<div className="row">
								{this.state.peoples.map(function(people) {
									return (
										<div key={people.id} className="col-xs-12 col-lg-4">
											<div className="panel panel-default">
												<div className="panel-heading">
													<label className="panel-title">
														<input
															type = "radio"
															name = "characterPeople"
															value = {people.id}
															onChange = {this.onPeopleChange}
														/>&nbsp;
														{people.title.rendered}
													</label>
												</div>
												<div
													className = "panel-body"
													dangerouslySetInnerHTML = {{__html: people.excerpt.rendered}}
												/>
											</div>
										</div>
									);
								}.bind(this))}
							</div>
						</div>

						<div className="form-group panel-group">
							<label>Compétence de départ</label>
							<p>
								Cette compétence détermine votre méthode de régénération principale,
								ainsi que votre point de départ sur le <Link to="/zodiaque/">Zodiaque</Link>.
							</p>
							<div className="row">
								{this.state.startingSkills.map(function(skill) {
									return (
										<div key={skill.id} className="col-xs-12 col-lg-4">
											<div className="panel panel-default">
												<div className="panel-heading">
													<label className="panel-title">
														<input
															type = "radio"
															name = "characterStartingSkill"
															value = {skill.id}
															onChange = {this.onStartingSkillChange}
														/>&nbsp;
														{skill.title.rendered}
													</label>
												</div>
												<div
													className = "panel-body"
													dangerouslySetInnerHTML = {{__html: skill.effect}}
												/>
											</div>
										</div>
									);
								}.bind(this))}
							</div>
						</div>

						<input
							type = "submit"
							className = "btn btn-success"
							value = "Créer un personnage"
							onClick = {this.createCharacter}
						/>

						{alert}
					</form>
				</div>
			);
		}

		return content;
	}

	/**
	 * Handle character name changes
	 * @param {MouseSyntheticEvent} event Mouse event
	 * @private
	 */
	onNameChange(event) {
		var newCharacter = Lodash.cloneDeep(this.state.character);
		newCharacter.name = event.target.value;

		this.setState({
			character: newCharacter
		});
	}

	/**
	 * Handle character people changes
	 * @param {MouseSyntheticEvent} event Mouse event
	 * @private
	 */
	onPeopleChange(event) {
		var newCharacter = Lodash.cloneDeep(this.state.character);
		newCharacter.people = event.target.value;

		this.setState({
			character: newCharacter
		});
	}

	/**
	 * Handle character starting skill changes
	 * @param {MouseSyntheticEvent} event Mouse event
	 * @private
	 */
	onStartingSkillChange(event) {
		var newCharacter = Lodash.cloneDeep(this.state.character);
		newCharacter.startingSkill = event.target.value;

		this.setState({
			character: newCharacter
		});
	}

	/**
	 * Handle save button click events
	 * @param {MouseSyntheticEvent} event Mouse event
	 * @private
	 */
	createCharacter(event) {
		event.preventDefault();

		if (
			this.state.character.name === '' ||
			this.state.character.people === null ||
			this.state.character.startingSkill === null
		) {
			this.setState({
				alert: {
					type: 'error',
					message: 'Veuillez remplir tous les champs'
				}
			});
			return;
		}

		this.setState({
			alert: {
				type: 'saving',
				message: 'Création du personnage...'
			}
		});

		jQuery.ajax({
			url: WP_API_Settings.root + 'wp/v2/character',
			method: 'POST',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);
			},
			data: {
				title: this.state.character.name,
				status: 'publish',
				people: this.state.character.people,
				starting_skill: this.state.character.startingSkill
			},
			success: function(response) {
				this.setState({
					alert: {
						type: 'saved',
						message: 'Personnage créé avec succès!'
					}
				});

				// Redirect to new character profile
				this.context.router.transitionTo('/personnage/' + response.slug + '/');

				if (this.props.onSwitchActiveCharacter) {
					this.props.onSwitchActiveCharacter(response.id, false);
				}
			}.bind(this)
		});
	}
}

/**
 * @type {Object}
 */
CharacterNewPage.propTypes = {
	onSwitchActiveCharacter: React.PropTypes.func
};

/**
 * @type {Object}
 */
CharacterNewPage.contextTypes = {
	router: React.PropTypes.object.isRequired
};
