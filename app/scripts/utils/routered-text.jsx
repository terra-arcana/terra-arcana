import React from 'react';

/**
 * A RouteredText element intercepts all regular <a> events inside its content
 * and pushes them through react-router's history instead.
 * @class
 */
export default class RouteredText extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props Default props
	 */
	constructor(props) {
		super(props);

		/**
		 * A ref to the html element containing the content
		 * @type {DOMElement}
		 */
		this.contentNode = null;
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var content = <div />;

		if (this.props.text) {
			content = (
				<div
					ref = {(ref) => this.contentNode = ref}
					dangerouslySetInnerHTML = {{__html: this.props.text }}
				/>
			);
		}

		return content;
	}

	/**
	 * @override
	 */
	componentDidMount() {
		window.requestAnimationFrame(function() {
			jQuery(this.contentNode).on('click', 'a', function(e) {
				var parsedUrl = RouteredText.parserPattern.exec(e.currentTarget.href);
				if (parsedUrl[1] === location.hostname) { // Only reroute links coming from this top domain
					e.preventDefault();
					this.context.router.push(parsedUrl[2]);
				}
			}.bind(this));
		}.bind(this));
	}

	/**
	 * @override
	 */
	componentWillUnmount() {
		jQuery(this.contentNode).off();
	}
}

/**
 * The pattern to extract the local route from a wordpress-bound URL
 * @type {regex}
 */
RouteredText.parserPattern = /\/{2}([^\/]+)(\/.*)/;

/**
 * @type {Object}
 */
RouteredText.propTypes = {
	text: React.PropTypes.string.isRequired
};

/**
 * @type {Object}
 */
RouteredText.contextTypes = {
	router: React.PropTypes.object.isRequired
};

/**
 * Strips the site's top domain off of a given URL.
 * @param {string} link The URL to parse
 * @return {string} The stripped link
 */
export function stripLinkDomain(link) {
	var parsedUrl = RouteredText.parserPattern.exec(link);
	if (parsedUrl[1] === location.hostname) { // Only reroute links coming from this top domain
		return parsedUrl[2];
	}
}
