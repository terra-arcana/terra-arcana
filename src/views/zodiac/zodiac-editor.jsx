import React from 'react';
import Lodash from 'lodash';

import SkillGraph from '../../../app/scripts/zodiac/skill-graph.jsx';
import SkillTooltip from '../../../app/scripts/zodiac/skill-tooltip.jsx';

require('./zodiac-editor.scss');

/**
 * Admin editor for the skill graph. Only displayed in WordPress backend.
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
			linkData: [],
			prompt: null
		};

		this.uninspect = this.uninspect.bind(this);
		this.onNodeClick = this.onNodeClick.bind(this);
		this.onPromptClose = this.onPromptClose.bind(this);
		this.saveZodiac = this.saveZodiac.bind(this);
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
			savePrompt = null,
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

		if (this.state.prompt !== null) {
			savePrompt = (
				<div className={'col-xs-12 col-lg-4 alert ' + this.state.prompt.type} role='alert'>
					<button type='button' className='close' aria-label='Close' onClick={this.onPromptClose}>
						<span aria-hidden='true'>&times;</span>
					</button>
					{this.state.prompt.message}
				</div>
			);
		}

		return (
			<div className="row">
				<SkillGraph 
					ref = {(ref) => this.graph = ref}
					initialNodeData = {this.state.nodeData}
					initialLinkData = {this.state.linkData}
					pickedNodes = {[rawNodeID]}
					canDragNodes = {true}
					contiguousSelection = {false}
					onNodeSelect = {this.onNodeClick}
					onNodeDrag = {this.onNodeDrag}
				></SkillGraph>

				{savePrompt}

				<div className='skill-graph-editor-control-panel'>
					<div className='panel panel-primary'>
						<div className='panel-heading clearfix'>
							<h2 className='skill-graph-editor-control-panel-title panel-title pull-left'>Panneau de contrôle</h2>
							<button type='button' className='btn btn-default btn-sm pull-right' onClick={this.saveZodiac}>Sauvegarder</button>
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
	 * Handle prompt close
	 */
	onPromptClose() {
		this.setState({
			prompt: null
		});
	}

	/**
	 * Save to the API the new state of the zodiac
	 */
	saveZodiac() {
		var data = {
			nodes: this.graph.getNodeData(),
			links: this.graph.getLinkData()
		};

		this.setState({
			prompt: {
				type: 'alert-info',
				message: 'Sauvegarde en cours...'
			}
		});

		jQuery.post(appLocals.api.terra + 'skill/graph-data', data, function(result, status) {
			if (status === 'success') {
				this.setState({
					prompt: {
						type: 'alert-success',
						message: result
					}
				});
			} else {
				this.setState({
					prompt: {
						type: 'alert-danger',
						message: result
					}
				});
			}
		}.bind(this));
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
