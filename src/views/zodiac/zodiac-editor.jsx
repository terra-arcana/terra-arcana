import React from 'react';
import Lodash from 'lodash';

import SkillGraph from '../../../app/scripts/zodiac/skill-graph.jsx';
import SkillNodeInspector from '../../../app/scripts/zodiac/skill-node-inspector.jsx';
import PointNodeInspector from '../../../app/scripts/zodiac/point-node-inspector.jsx';
import NodeDetailsLinkElement from './node-details-link-element.jsx';

require('./zodiac-editor.scss');

/**
 * A ZodiacEditor renders an editable {@link SkillGraph}. Only displayed in WordPress backend.
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
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			}, 
			nodeData: [],
			linkData: [],
			deletedNodes: [],
			highlightedOutboundLink: null,
			prompt: null,
			addingLinkFrom: null
		};

		/**
		 * Number of new nodes that have been created during this session
		 * @type {Number}
		 * @private
		 */
		this.newNodeCount = 0;

		this.uninspect = this.uninspect.bind(this);
		this.createPointNode = this.createPointNode.bind(this);
		this.deletePointNode = this.deletePointNode.bind(this);
		this.addLink = this.addLink.bind(this);
		this.deleteLink = this.deleteLink.bind(this);
		this.onAddLinkButtonClick = this.onAddLinkButtonClick.bind(this);
		this.highlightLink = this.highlightLink.bind(this);
		this.unhighlightLink = this.unhighlightLink.bind(this);
		this.onNodeClick = this.onNodeClick.bind(this);
		this.onPromptClose = this.onPromptClose.bind(this);
		this.onPointNodeValueChange = this.onPointNodeValueChange.bind(this);
		this.saveZodiac = this.saveZodiac.bind(this);
		this.getNewNodeIndexes = this.getNewNodeIndexes.bind(this);
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get('http://' + location.hostname + '/wp-json/terraarcana/v1/graph-data', function(result) {
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
		var inspector = null,
			activeNodeData = null,
			nodeDetails = null,
			savePrompt = null,
			nodeDetailsTitle = null,
			deletePointNodeButton = null,
			pointNodeValueInput = null,
			highlightedLinks = [],
			rawNodeID = [this.state.activeNode.id].concat(this.state.activeNode.upgrades).join('-'); // TODO: Test for emptiness

		if (!Lodash.isEmpty(this.state.activeNode) && !!this.state.activeNode.id) {
			activeNodeData = this.getNodeDataById(rawNodeID);
			
			// Render inspector
			switch(this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				nodeDetailsTitle = (activeNodeData.type === 'skill') ? 'Noeud de compétence' : 'Noeud d\'amélioration';
				inspector = <SkillNodeInspector skill={this.state.activeNode} />;
				break;
			
			case 'life':
			case 'perk':
				nodeDetailsTitle = (activeNodeData.type === 'life') ? 'Noeud d\'énergie' : 'Noeud d\'essence';
				inspector = <PointNodeInspector pointNode={activeNodeData} />;
				deletePointNodeButton = (
					<button 
						type = 'button'
						className = 'btn btn-danger btn-sm pull-right'
						data-toggle = 'modal'
						data-target = '#deletePointNodeModal'>
						<span className='glyphicon glyphicon-remove' />&nbsp;
						Supprimer
					</button>
				);
				pointNodeValueInput = (
					<div className='input-group'>
						<span className='input-group-addon'>Valeur</span>
						<input
							ref = {(ref) => this.pointNodeValueInput = ref}
							type = 'number'
							className = 'form-control'
							value = {activeNodeData.value}
							onChange = {this.onPointNodeValueChange}
						/>
						<span className='input-group-addon'>points</span>
					</div>
				);
				break;
			}

			// Render node details panel
			nodeDetails = (
				<div className='skill-graph-editor-control-panel-node-details'>
					{deletePointNodeButton}
					<h3>{nodeDetailsTitle}</h3>

					{pointNodeValueInput}

					<div className='skill-graph-editor-control-panel-links panel panel-info'>
						<div className='panel-heading clearfix'>
							<h4 className='panel-title'>Liens</h4>
						</div>
						<table className='table'>
							<colgroup>
								<col span='1' style={{width: '90%'}} />
								<col span='1' style={{width: '10%'}} />
							</colgroup>
							<tbody>
								{this.graph.getLinkedNodesById(rawNodeID).map(function(link) {

									return (
										<NodeDetailsLinkElement 
											key = {link}
											node = {this.getNodeDataById(link)}
											highlight = {this.state.highlightedOutboundLink === link}
											onMouseOver = {this.highlightLink.bind(this, link)}
											onMouseOut = {this.unhighlightLink}
											onDelete = {this.deleteLink.bind(this, rawNodeID, link)}
										/>
									);
								}.bind(this))}
							</tbody>
						</table>
						<div className='panel-body'>
							<button 
								ref = {(ref) => this.addLinkButton = ref}
								type = 'button'
								className = 'btn btn-success btn-sm'
								onClick = {this.onAddLinkButtonClick.bind(this, rawNodeID)}>
								<span className='glyphicon glyphicon-plus' />&nbsp;
								Ajouter un lien
							</button>
						</div>
					</div>
				</div>
			);
		}

		// Render save prompt
		if (this.state.prompt !== null) {
			savePrompt = (
				<div className='col-xs-12 col-lg-4'>
					<div className={'alert ' + this.state.prompt.type} role='alert'>
						<button type='button' className='close' aria-label='Close' onClick={this.onPromptClose}>
							<span aria-hidden='true'>&times;</span>
						</button>
						<span className={'glyphicon ' + this.state.prompt.icon} />&nbsp;
						{this.state.prompt.message}
					</div>
				</div>
			);
		}

		// Build highlighted links data
		if (this.state.highlightedLink !== null) {
			highlightedLinks.push([rawNodeID, this.state.highlightedOutboundLink]);
		}

		return (
			<div>
				<div className='row'>
					<SkillGraph 
						ref = {(ref) => this.graph = ref}
						initialNodeData = {this.state.nodeData}
						initialLinkData = {this.state.linkData}
						pickedNodes = {[rawNodeID]}
						canDragNodes = {true}
						contiguousSelection = {false}
						highlightedLinks = {highlightedLinks}
						onNodeSelect = {this.onNodeClick}
					/>

					{savePrompt}

					<div className='col-xs-12 col-lg-4 skill-graph-editor-control-panel'>
						<div className='panel panel-primary'>
							<div className='panel-heading clearfix'>
								<h2 className='skill-graph-editor-control-panel-title panel-title pull-left'>Panneau de contrôle</h2>
								<button 
									type = 'button' 
									className = 'btn btn-default btn-sm pull-right' 
									onClick = {this.saveZodiac}>
									<span className='glyphicon glyphicon-floppy-disk' />&nbsp;
									Sauvegarder
								</button>
							</div>
							<div className='panel-body'>
								<div className='btn-group' role='group'>
									<button 
										ref = {(ref) => this.addLifeNodeButton = ref}
										type = 'button'
										className = 'btn btn-sm btn-success'
										onClick = {this.createPointNode.bind(this, 'life')}>
										<span className='glyphicon glyphicon-plus' />&nbsp;
										Noeud d'énergie
									</button>
									<button 
										ref = {(ref) => this.addPerkNodeButton = ref}
										type = 'button'
										className = 'btn btn-sm btn-success'
										onClick = {this.createPointNode.bind(this, 'perk')}>
										<span className='glyphicon glyphicon-plus' />&nbsp;
										Noeud d'essence
									</button>
								</div>
								
								{nodeDetails}
							</div>
						</div>
					</div>

					{inspector}
				</div>

				<div className='modal fade' id='deletePointNodeModal' tabIndex='-1' role='dialog'>
					<div className='modal-dialog' role='document'>
						<div className='modal-content'>
							<div className='modal-header'>
								<button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
								<h4 className='modal-title'>Confirmation de suppression</h4>
							</div>
							<div className='modal-body'>
								Êtes-vous certain de vouloir supprimer ce noeud?
							</div>
							<div className='modal-footer'>
								<button type='button' className='btn btn-default' data-dismiss='modal'>Annuler</button>
								<button
									ref = {(ref) => this.deletePointNodeButton = ref}
									type = 'button'
									className = 'btn btn-danger'
									data-dismiss = 'modal'
									onClick = {this.deletePointNode}>
									Supprimer
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Clear active skill and stop inspecting
	 * @private
	 */
	uninspect() {
		this.setState({
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			}
		});
	}

	/**
	 * Creates a new point node and adds it to the graph
	 * @param {string} type The new type of the node, `life` or `perk`
	 * @private
	 */
	createPointNode(type) {
		var newNodeData = Lodash.cloneDeep(this.graph.getNodeData());

		newNodeData.push({
			id: 'n' + this.newNodeCount,
			type: type,
			value: '0',
			x: 0,
			y: 0
		});

		this.newNodeCount++;

		this.setState({
			nodeData: newNodeData
		});
	}

	/**
	 * Deletes a point node from the graph
	 * @private
	 */
	deletePointNode() {
		var newNodeData = Lodash.cloneDeep(this.graph.getNodeData()),
			newDeletedNodes = Lodash.cloneDeep(this.state.deletedNodes);

		for (var i = 0; i < this.state.nodeData.length; i++) {
			if (this.state.nodeData[i].id === this.state.activeNode.id) {
				newNodeData.splice(i, 1);
			}
		}

		newDeletedNodes.push(this.state.activeNode.id);

		this.setState({
			nodeData: newNodeData,
			deletedNodes: newDeletedNodes,
			activeNode: {
				id: '',
				type: '',
				upgrades: []
			}
		});
	}

	/**
	 * Adds a new link to the zodiac
	 * @param {string} from The origin node
	 * @param {string} to The destination node
	 */
	addLink(from, to) {
		var newLinkData = Lodash.cloneDeep(this.state.linkData);

		newLinkData.push([from, to]);

		this.setState({
			linkData: newLinkData,
			addingLinkFrom: null,
			prompt: {
				type: 'alert-success',
				icon: 'glyphicon-ok',
				message: 'Lien ajouté avec succès!'
			}
		});
	}

	/**
	 * Deletes a link from two nodes
	 * @param {string} from The first link
	 * @param {string} to The second link
	 * @private
	 */
	deleteLink(from, to) {
		var newLinkData = Lodash.cloneDeep(this.state.linkData),
			link = [];

		for (var i = 0; i < newLinkData.length; i++) {
			link = newLinkData[i];

			if ((link[0] === from && link[1] === to) ||
				(link[1] === from && link[0] === to)) {
				break;
			}
		}

		newLinkData.splice(i, 1);

		this.setState({
			linkData: newLinkData
		});
	}

	/**
	 * Enter link creation mode after user input
	 * @param {string} from The source node
	 * @private
	 */
	onAddLinkButtonClick(from) {
		this.setState({
			addingLinkFrom: from,
			prompt: {
				type: 'alert-info',
				icon: 'glyphicon-link',
				message: 'Choisir le noeud de destination...'
			}
		});
	}

	/**
	 * Highlight an outbound link
	 * @param {string} target Target node ID
	 */
	highlightLink(target) {
		this.setState({
			highlightedOutboundLink: target
		});
	}

	/**
	 * Unhighlight links
	 */
	unhighlightLink() {
		this.setState({
			highlightedOutboundLink: null
		});
	}

	/**
	 * Select or unselect a node
	 * @param {string} id The picked node ID
	 */
	onNodeClick(id) {
		// Build node obj
		var nodeData = this.getNodeDataById(id),
			splitID = id.split('-'),
			nodeObj = {
				id: splitID[0], 
				type: nodeData.type,
				upgrades: []
			};

		// Link insertion mode
		if (this.state.addingLinkFrom) {
			this.addLink(this.state.addingLinkFrom, id);
		}

		// Selection mode
		else {
			if (nodeData.type === 'skill' || nodeData.type === 'upgrade') {
				if (splitID[1] !== undefined) {
					nodeObj.upgrades.push(splitID[1]);
				}
			}

			// Unselect active node if clicked, select new node otherwise
			if (Lodash.isEqual(this.state.activeNode, nodeObj)) {
				this.uninspect();
			} else {
				this.setState({
					nodeData: this.graph.getNodeData(),
					linkData: this.graph.getLinkData(),
					activeNode: nodeObj
				});
			}
		}
	}

	/**
	 * Handle prompt close
	 * @private
	 */
	onPromptClose() {
		this.setState({
			prompt: null
		});
	}

	/**
	 * Handle point node value changes through user input
	 * @param {SyntheticEvent} e The change event
	 * @private
	 */
	onPointNodeValueChange(e) {
		var nodeData = this.graph.getNodeData(),
			linkData = this.graph.getLinkData();

		for (var i = 0; i < nodeData.length; i++) {
			if (nodeData[i].id === this.state.activeNode.id) {
				nodeData[i].value = e.target.value;
			}
		}

		this.setState({
			nodeData: nodeData,
			linkData: linkData
		});
	}

	/**
	 * Save to the API the new state of the zodiac
	 * @private
	 */
	saveZodiac() {
		var data = {
			nodes: this.graph.getNodeData(),
			links: this.graph.getLinkData(),
			newNodeIndexes: this.getNewNodeIndexes(),
			deletedNodes: this.state.deletedNodes
		};

		this.setState({
			nodeData: data.nodes,
			linkData: data.links,
			prompt: {
				type: 'alert-info',
				icon: 'glyphicon-floppy-open',
				message: 'Sauvegarde en cours...'
			}
		});

		jQuery.post('http://' + location.hostname + '/wp-json/terraarcana/v1/graph-data', data, function(result, status) {
			if (status === 'success') {
				this.setState({
					prompt: {
						type: 'alert-success',
						icon: 'glyphicon-floppy-saved',
						message: result
					}
				});
			} else {
				this.setState({
					prompt: {
						type: 'alert-danger',
						icon: 'glyphicon-floppy-remove',
						message: result
					}
				});
			}
		}.bind(this));
	}

	/**
	 * Return the data of a particular node by ID
	 * @param {string} id The node ID
	 * @return {Object|null} The node data
	 * @private
	 */
	getNodeDataById(id) {
		var nodeData = null;

		this.state.nodeData.map(function(node) {
			if (node.id === id) {
				nodeData = node;
			}
		}.bind(this));

		return nodeData;
	}

	/**
	 * Get all indexes of newly created nodes in the graph node data
	 * @return {Array}
	 * @private
	 */
	getNewNodeIndexes() {
		var nodeData = this.graph.getNodeData(),
			result = [];

		for (var i = 0; i < nodeData.length; i++) {
			if (nodeData[i].id[0] === 'n') {
				result.push(i);
			}
		}

		return result;
	}
}
