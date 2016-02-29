import React from 'react';
import ReactDOM from 'react-dom';

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

ReactDOM.render(<ZodiacAdminApp/>, document.getElementById('main'));
