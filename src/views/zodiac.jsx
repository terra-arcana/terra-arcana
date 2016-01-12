import React from 'react';

import CharacterBuilder from '../../app/scripts/zodiac/character-builder.jsx';

/**
 * Admin zodiac edition wrapper
 *
 * @class
 */
class ZodiacAdminApp extends React.Component {
	
	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<CharacterBuilder/>
		);
	}
}

React.render(<ZodiacAdminApp/>, document.getElementById('main'));
