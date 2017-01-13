import React from 'react';
import ReactDOM from 'react-dom';

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
			events: []
		};

		this.getPlayer = this.getPlayer.bind(this);
	}

	componentDidMount() {
		var characterData = [],
			playerData = [],
			eventData = [],

			characterRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/character?per_page=100', function(result) {
				characterData = result;
			}),

			playerRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/users?per_page=100', function(result) {
				playerData = result;
			}),

			eventRequest = jQuery.get(WP_API_Settings.root + 'wp/v2/event?er_page=100', function(result) {
				eventData = result;
			});

		jQuery.when(characterRequest, playerRequest, eventRequest).done(function() {
			this.setState({
				characters: characterData,
				players: playerData,
				events: eventData
			});
		}.bind(this));
	}

	/**
	 * @override
	 */
	render() {
		var content = <Spinner />;

		if (this.state.characters.length) {
			let headerRow = (
				<tr>
					<th className="ta-character-name-row">Nom</th>
					<th>Joueur</th>
					<th>GNs participés</th>
					<th>GNs participés (joueur)</th>
					<th className="ta-bonus-xp-row">Bonus</th>
					<th>Total</th>
				</tr>
			);

			content = (
				<table className="table table-hover ta-table">
					<thead>{headerRow}</thead>
					<tbody>
						{this.state.characters.map(function(character) {
							return (
								<tr key={character.id}>
									<td><strong dangerouslySetInnerHTML={{__html: character.title.rendered}} /></td>
									<td>{this.getPlayer(character.author).name}</td>
									<td>{character.xp.from_events}</td>
									<td>{character.xp.from_user}</td>
									<td>
										<div className="input-group">
											<input
												type = "text"
												className = "form-control"
												value = {character.xp.bonus}
											/>
											<span className="input-group-addon">PX</span>
										</div>
									</td>
									<td><strong>{character.xp.total}</strong></td>
								</tr>
							);
						}.bind(this))}
					</tbody>
					<tfoot>{headerRow}</tfoot>
				</table>
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
}

ReactDOM.render(<XpAdminApp />, document.getElementById('main'));
