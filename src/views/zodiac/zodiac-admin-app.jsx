import React from 'react';

import ZodiacEditor from './zodiac-editor.jsx';

/**
 * Admin zodiac edition wrapper
 * @class
 */
export default class ZodiacAdminApp extends React.Component {
	
	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		return (
			<ZodiacEditor/>
		);
	}
}

React.render(<ZodiacAdminApp/>, document.getElementById('main'));
