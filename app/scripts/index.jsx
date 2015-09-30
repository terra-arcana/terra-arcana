/* jshint ignore:start */

import React from 'react';

import Greeting from './greeting.jsx';

export default React.createClass({
	render: render
});

function render() {
	return (
		<div>
			<Greeting name="World" />
		</div>
	);
}
