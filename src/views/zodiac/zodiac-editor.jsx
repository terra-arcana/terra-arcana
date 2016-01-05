import React from 'react';
import Lodash from 'lodash';

import SkillGraph from '../../../app/scripts/zodiac/skill-graph.jsx';
import SkillTooltip from '../../../app/scripts/zodiac/skill-tooltip.jsx';

require('./zodiac-editor.scss');

/**
 * Admin editor for the skill graph. Only displayed in WordPress backend.
 *
 * @class
 */
export default class ZodiacEditor extends React.Component {
	
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
			activeSkill: {
				id: '',
				upgrades: []
			}, 
			activeSkillCoordinates: {
				x: '',
				y: ''
			},
			nodeData: [],
			linkData: []
		};

		this.uninspect = this.uninspect.bind(this);
		this.onNodeClick = this.onNodeClick.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(appLocals.api.terra + 'skill/graph-data', function(result) {
			this.setState({
				nodeData: result.nodes,
				linkData: result.links
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var skillTooltip = null,
			activeNodeData = null,
			nodeDetails = null,
			rawNodeID = [this.state.activeSkill.id].concat(this.state.activeSkill.upgrades).join('-');

		if (this.state.activeSkill.id !== '') {
			skillTooltip = (
				<SkillTooltip
					skill = {this.state.activeSkill}
				></SkillTooltip>
			);

			activeNodeData = this.getNodeDataById(rawNodeID);

			nodeDetails = (
				<div className='skill-graph-editor-node-details panel panel-info'>
					<div className='panel-heading'>
						<h3 className='panel-title'>Noeud #{activeNodeData.id}</h3>
					</div>
					<div className='panel-body'>
					</div>
				</div>
			);
		}

		return (
			<div className="row">
				<SkillGraph 
					initialNodeData = {this.state.nodeData}
					initialLinkData = {this.state.linkData}
					pickedNodes = {[rawNodeID]}
					canDragNodes = {true}
					contiguousSelection = {false}
					onSelectNode = {this.onNodeClick}
				></SkillGraph>

				<div className='skill-graph-editor-control-panel'>
					<div className='panel panel-primary'>
						<div className='panel-heading clearfix'>
							<h2 className='skill-graph-editor-control-panel-title panel-title pull-left'>Panneau de contrôle</h2>
							<button type='button' className='btn btn-default btn-sm pull-right'>Sauvegarder</button>
						</div>
						<div className='panel-body'>
							<button type='button' className='btn btn-default'>Ajouter un noeud d'énergie</button>
							<button type='button' className='btn btn-default'>Ajouter un noeud d'essence</button>
							
							{nodeDetails}
						</div>
					</div>
				</div>

				{skillTooltip}
			</div>
		);
	}

	/**
	 * Clear active skill and stop inspecting
	 * @private
	 */
	uninspect() {
		this.setState({
			activeSkill: {
				id: '',
				upgrades: []
			},
			activeSkillCoordinates: {
				x: '',
				y: ''
			}
		});
	}

	/**
	 * Select or unselect a node
	 * @param {String} id The picked node ID
	 * @private
	 */
	onNodeClick(id) {
		// Build node obj
		var splitID = id.split('-'),
			nodeObj = {
				id: splitID[0],
				upgrades: []
			};

		if (splitID[1] !== undefined) {
			nodeObj.upgrades.push(splitID[1]);
		}

		// Unselect active node if clicked, select new node otherwise
		if (Lodash.isEqual(this.state.activeSkill, nodeObj)) {
			this.uninspect();
		} else {
			// TODO: Fetch active skill coords from graph
			this.setState({
				activeSkill: nodeObj
			});
		}
	}

	/**
	 * Return the data of a particular node by ID
	 * @param {String} id The node ID
	 * @return {Node|null} The node
	 */
	getNodeDataById(id) {
		var returnNode = null;

		this.state.nodeData.map(function(node) {
			if (node.id === id) {
				returnNode = node;
			}
		}.bind(this));

		return returnNode;
	}
}
