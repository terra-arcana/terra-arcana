import React from 'react';

import Greeting from './greeting.jsx';

var index = {
	displayName: 'Index'
};

/* Methods */

/**
 * Render the index component
 * 
 * @return {jsx} The component template
 */
index.render = function() {
	return (
		<div>
			<Greeting name="World" />
		</div>
	);
};

/* Export */

export default React.createClass(index);
