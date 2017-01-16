import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';

import Spinner from '../../../app/scripts/layout/spinner.jsx';

require('./xp-admin-app.scss');

/**
 * An XpAdminApp displays the main view for managing the XP levels of characters.
 * @class
 */
export default class XpAdminApp extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * @private
		 */
		this.state = {
			characters: [],
			players: [],
			events: [],
			selectedCharacters: [],
			bonusValues: {}
		};

		this.getPlayer = this.getPlayer.bind(this);
		this.onToggleCharacter = this.onToggleCharacter.bind(this);
		this.onToggleAll = this.onToggleAll.bind(this);
		this.onBonusXpChanged = this.onBonusXpChanged.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		var characterData = [],
			playerData = [],
			eventData = [],
			bonusValues = {},

			// TODO: Handle more than 100 characters
			characterRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/character?per_page=100&order=asc&orderby=title', result => {
				characterData = result;

				for (let i = 0; i < result.length; ++i) {
					bonusValues[result[i].id] = result[i].xp.bonus;
				}
			}),

			playerRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/users?per_page=100', result => {
				playerData = result;
			}),

			eventRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/event?er_page=100', result => {
				eventData = result;
			});

		jQuery.when(characterRequest, playerRequest, eventRequest).done(() => {
			this.setState({
				characters: characterData,
				players: playerData,
				events: eventData,
				bonusValues: bonusValues
			});
		});
	}

	/**
	 * @override
	 */
	render() {
		var content = <Spinner />;

		if (this.state.characters.length) {
			let allCharactersSelected = (this.state.selectedCharacters.length === this.state.characters.length);
			let headerRow = (
				<tr>
					<th>
						<input
							type = "checkbox"
							checked = {allCharactersSelected}
							onChange = {this.onToggleAll}
						/>
					</th>
					<th className="ta-character-name-row">Nom</th>
					<th>Joueur</th>
					<th>GNs participés</th>
					<th>GNs participés (joueur)</th>
					<th className="ta-bonus-xp-row">Bonus</th>
					<th>Total</th>
				</tr>
			);

			content = (
				<div>
					<div className="alert alert-info">
						<strong>Seuls les personnages sélectionnés seront modifiés.</strong><br />
						Les premières valeurs sont les valeurs recalculées, celles en <em>(parenthèses)</em> sont les valeurs actuelles.
					</div>
					<table className="table table-hover ta-table">
						<thead>{headerRow}</thead>
						<tbody>
							{this.state.characters.map(character => {
								let checked = (this.state.selectedCharacters.indexOf(character.id) !== -1),
									rowClass = (checked) ? 'success' : '',
									bonus = this.state.bonusValues[character.id],
									total = character.xp.base + character.xp.from_events + character.xp.from_user + bonus,
									totalClass = '';

								if (total < character.xp.total) {
									totalClass = 'text-danger';
								} else if (total > character.xp.total) {
									totalClass = 'text-success';
								}

								return (
									<tr
										key = {character.id}
										className = {rowClass}
									>
										<td>
											<input
												type = "checkbox"
												checked = {checked}
												onChange = {this.onToggleCharacter.bind(this, character.id)}
											/>
										</td>
										<td><strong dangerouslySetInnerHTML={{__html: character.title.rendered}} /></td>
										<td>{this.getPlayer(character.author).name}</td>
										<td>{character.xp.from_events}</td>
										<td>{character.xp.from_user}</td>
										<td>
											<div className="input-group">
												<input
													type = "text"
													className = "form-control"
													value = {(bonus !== 0) ? bonus : ''}
													onChange = {this.onBonusXpChanged.bind(this, character.id)}
												/>
												<span className="input-group-addon">PX</span>
											</div>
										</td>
										<td><strong className={totalClass}>{total}</strong> <em>({character.xp.total})</em></td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>{headerRow}</tfoot>
					</table>
					<button type="button" className="btn btn-primary pull-right">Soumettre les modifications</button>
				</div>
			);
		}

		return content;
	}

	/**
	 * Get a player by ID from the player data
	 * @param {Number} id The player ID
	 * @return {Object|null} THe player entry
	 * @private
	 */
	getPlayer(id) {
		if (this.state.players.length) {
			for (let i = 0; i < this.state.players.length; ++i) {
				let player = this.state.players[i];
				if (player.id === id) {
					return player;
				}
			}
		}

		return null;
	}

	/**
	 * Toggles the selection of a single character
	 * @param {string} characterId The character ID
	 * @private
	 */
	onToggleCharacter(characterId) {
		const index = this.state.selectedCharacters.indexOf(characterId);
		var newData = this.state.selectedCharacters.slice();

		if (index === -1) {
			newData.push(characterId);
		} else {
			newData.splice(index, 1);
		}

		this.setState({selectedCharacters: newData});
	}

	/**
	 * Toggles the selection of all characters on or off.
	 * @param {SyntheticEvent} event The change event
	 * @private
	 */
	onToggleAll(event) {
		var newSelectedCharacters = [];

		if (event.target.checked) {
			for (let i = 0; i < this.state.characters.length; ++i) {
				newSelectedCharacters.push(this.state.characters[i].id);
			}
		}

		this.setState({
			selectedCharacters: newSelectedCharacters
		});
	}

	/**
	 * Handle bonus XP changes for a character
	 * @param {string} characterId The character ID
	 * @param {SyntheticEvent} event The change event
	 * @private
	 */
	onBonusXpChanged(characterId, event) {
		var newBonus = parseInt(event.target.value);
		if (isNaN(newBonus)) {
			newBonus = 0;
		}

		var newBonusValues = update(this.state.bonusValues, {
			[characterId]: {$set: newBonus}
		});

		this.setState({
			bonusValues: newBonusValues
		});
	}
}

ReactDOM.render(<XpAdminApp />, document.getElementById('main'));
