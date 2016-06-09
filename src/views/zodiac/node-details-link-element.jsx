import React from 'react';

/**
 * A NodeDetailsLinkElement describes one link within a node details panel inside
 * the {@link ZodiacEditor}. The user can use it to highlight {@link NodeLink} 
 * components within the graph and send a delete link action.
 * @class
 */
export default class NodeDetailsLinkElement extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props Custom props
	 */
	constructor(props) {
		super(props);

		/**
		 * @type {Object}
		 * @private
		 */
		this.state = {
			name: 'Chargement...'
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		/**
		 * REST request to the details about the outbound node
		 * @type {jqXHR}
		 * @private
		 */
		this.fetchSkillRequest = null;

		switch(this.props.node.type) {
		case 'skill':
			this.fetchSkillRequest = jQuery.get('http://' + location.hostname + '/wp-json/wp/v2/skill/' + this.props.node.id, function(result) {
				this.setState({
					name: result.title.rendered
				});
			}.bind(this));
			break;
		case 'upgrade':
			var splitID = this.props.node.id.split('-');
			this.fetchSkillRequest = jQuery.get('http://' + location.hostname + '/wp-json/wp/v2/skill/' + splitID[0], function(result) {
				this.setState({
					name: result.upgrades[splitID[1]-1].title
				});
			}.bind(this));
			break;
		case 'life':
			this.setState({
				name: this.props.node.value + ' Énergie'
			});
			break;
		case 'perk':
			this.setState({
				name: this.props.node.value + ' Essence'
			});
		}
	}

	/**
	 * @override
	 */
	componentWillUnmount() {
		if (this.fetchSkillRequest !== null) {
			this.fetchSkillRequest.abort();
		}
	}

	/**
	 * @override
	 * @return {HTMLDomElement} The component template
	 */
	render() {
		return (
			<tr
				className = {(this.props.highlight) ? 'active' : ''}
				onMouseOver = {this.props.onMouseOver}
				onMouseOut = {this.props.onMouseOut}>
				<td>{this.state.name}</td>
				<td>
					<button
						type = 'button'
						className = 'btn btn-xs btn-danger'
						onClick = {this.props.onDelete}>
						<span className = 'glyphicon glyphicon-remove' />
					</button>
				</td>
			</tr>
		);
	}
}

/**
 * @override
 * @type {Object}
 */
NodeDetailsLinkElement.propTypes = {
	node: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		type: React.PropTypes.string.isRequired,
		value: React.PropTypes.string
	}).isRequired,
	highlight: React.PropTypes.bool.isRequired,

	onMouseOver: React.PropTypes.func,
	onMouseOut: React.PropTypes.func,
	onDelete: React.PropTypes.func
};
