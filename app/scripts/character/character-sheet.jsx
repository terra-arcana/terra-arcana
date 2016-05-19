import React from 'react';

/**
 * A CharacterSheet is a view detailing all of the character's useful information
 * in a print-friendly format.
 * @class
 */
export default class CharacterSheetPage extends React.Component {

	/**
	 * @override
	 * @return {html} The component template
	 */
	render() {
		return (
			<div className="ta-character-sheet">
				<h2 className="col-xs-12">
					Fiche de personnage&nbsp;
					<a href="#" className="btn btn-primary btn-sm" onClick={() => window.print()}>
						<span className="glyphicon glyphicon-print no-events" />
						<span className="no-events">&nbsp;Imprimer</span>
					</a>
				</h2>

				<div className="col-xs-12">
					<div className="alert alert-warning">Bientôt disponible!</div>
				</div>
			</div>
		);
	}
}
