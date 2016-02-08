import React from 'react';
import Lodash from 'lodash';

import SkillGraph from '../../../app/scripts/zodiac/skill-graph.jsx';
import SkillNodeInspector from '../../../app/scripts/zodiac/skill-node-inspector.jsx';
import PointNodeInspector from '../../../app/scripts/zodiac/point-node-inspector.jsx';

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
			rawNodeID = [this.state.activeNode.id].concat(this.state.activeNode.upgrades).join('-'); // TODO: Test for emptiness

		if (!Lodash.isEmpty(this.state.activeNode)) {
			// Render inspector
			switch(this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				inspector = <SkillNodeInspector skill={this.state.activeNode} />;
				break;
			case 'life':
			case 'perk':
				inspector = <PointNodeInspector pointNode={this.getNodeDataById(this.state.activeNode.id)} />;
				break;
			}

			// Render node details panel
			activeNodeData = this.getNodeDataById(rawNodeID);

			if (activeNodeData) {
				nodeDetails = (
					<div className='skill-graph-editor-node-details panel panel-info'>
						<div className='panel-heading'>
							<h3 className='panel-title'>Détails du noeud</h3>
						</div>
						<div className='panel-body'>
						</div>
					</div>
				);
			}
		}

		// Render save prompt
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
				/>

				{savePrompt}

				<div className='skill-graph-editor-control-panel'>
					<div className='panel panel-primary'>
						<div className='panel-heading clearfix'>
							<h2 className='skill-graph-editor-control-panel-title panel-title pull-left'>Panneau de contrôle</h2>
							<button type='button' className='btn btn-default btn-sm pull-right' onClick={this.saveZodiac}>Sauvegarder</button>
						</div>
						<div className='panel-body'>
							{/*<button type='button' className='btn btn-default'>Ajouter un noeud d'énergie</button>*/}
							{/*<button type='button' className='btn btn-default'>Ajouter un noeud d'essence</button>*/}
							
							{nodeDetails}
						</div>
					</div>
				</div>

				{inspector}
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
	 * Select or unselect a node
	 * @param {String} id The picked node ID
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
				activeNode: nodeObj
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
	 * @private
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

		jQuery.post('http://' + location.hostname + '/wp-json/terraarcana/v1/graph-data', data, function(result, status) {
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
}
