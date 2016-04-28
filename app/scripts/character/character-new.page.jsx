import React from 'react';

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

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			characterName: '',
			peoples: [],
			startingSkills: [
				{
					id: '1',
					title: {
						rendered: 'Endurance'
					},
					effect: 'Plus de vie'
				},
				{
					id: '2',
					title: {
						rendered: 'Méditation'
					},
					effect: 'Plus de regen'
				},
				{
					id: '3',
					title: {
						rendered: 'Immersion'
					},
					effect: 'Plus de pioupiou'
				}
			]
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'wp/v2/people', function(result) {
			this.setState({
				peoples: result
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {HTML} The component template
	 */
	render() {
		var content = (
			<span className="glyphicon glyphicon-asterisk glyphicon-spin" />
		);

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
						/>
					</form>
				</div>
			);
		}

		return content;
	}
}
