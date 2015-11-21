import React from "react";

var greeting = {};

/* Methods */

/**
 * Render the greeting component
 * 
 * @return {jsx} The component template
 */
greeting.render = function() {
	return (
		<div className="greeting">
			Hello, {this.props.name}!
		</div>
	);
};

/* Export */

export default React.createClass(greeting);
