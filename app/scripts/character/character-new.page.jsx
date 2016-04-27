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
			characterName: ''
		};
	}

	/**
	 * @override
	 * @return {HTML} The component template
	 */
	render() {
		return (
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
							{this.props.peoples.map(function(people) {
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
												dangerouslySetInnerHTML = {{__html: people.content.rendered}}
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
							{this.props.startingSkills.map(function(skill) {
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
}

CharacterNewPage.defaultProps = {
	peoples: [
		{
			id: '1',
			title: {
				rendered: 'Darenhels'
			},
			content: {
				rendered: 'Blabla'
			}
		},
		{
			id: '2',
			title: {
				rendered: 'Galiciens'
			},
			content: {
				rendered: 'Blabla'
			}
		},
		{
			id: '3',
			title: {
				rendered: 'Qaholoms'
			},
			content: {
				rendered: 'Blabla'
			}
		},
		{
			id: '4',
			title: {
				rendered: 'Constantins'
			},
			content: {
				rendered: 'Blabla'
			}
		},
		{
			id: '5',
			title: {
				rendered: 'Itzamas'
			},
			content: {
				rendered: 'Blabla'
			}
		},
		{
			id: '6',
			title: {
				rendered: 'Jarllanders'
			},
			content: {
				rendered: 'Blabla'
			}
		}
	],
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
