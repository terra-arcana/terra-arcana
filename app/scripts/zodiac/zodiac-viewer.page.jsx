import React from 'react';

import PageHeader from '../layout/page-header.jsx';
import PointNodeInspector from './point-node-inspector.jsx';
import SkillGraph from './skill-graph.jsx';
import SkillNodeInspector from './skill-node-inspector.jsx';

export default class ZodiacViewerPage extends React.Component {

	constructor(props) {
		super(props);

		this.inspectSkill = this.inspectSkill.bind(this);
		this.uninspect = this.uninspect.bind(this);
		this.getNodeDataById = this.getNodeDataById.bind(this);

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
			graphMetadata: {}
		};
	}

	/**
	 * @override
	 */
	componentDidMount() {
		jQuery.get(WP_API_Settings.root + 'terraarcana/v1/graph-data', function(result) {
			this.setState({
				activeNode: {
					id: '',
					type: '',
					upgrades: []
				},
				nodeData: result.nodes,
				linkData: result.links,
				graphMetadata: result.meta
			});
		}.bind(this));
	}

	/**
	 * @override
	 * @return {jsx} The component template
	 */
	render() {
		var inspector = <noscript />;

		if (this.state.activeNode.id !== '') {
			switch (this.state.activeNode.type) {
			case 'skill':
			case 'upgrade':
				inspector = (
					<SkillNodeInspector
						skill = {this.state.activeNode}
						metadata = {this.state.graphMetadata}
					/>
				);
				break;

			case 'perk':
			case 'life':
				inspector = (
					<PointNodeInspector
						pointNode = {this.getNodeDataById(this.state.activeNode.id)}
					/>
				);
			}
		}

		return (
			<div className="ta-zodiac-viewer">
				<PageHeader
					content = "<h1>Le Zodiaque <small>L'étendue complète des compétences priorèmes connues</small></h1>"
				/>
				<div className="row">
					<div className="col-sm-12 col-lg-8">
						<SkillGraph
							initialNodeData = {this.state.nodeData}
							initialLinkData = {this.state.linkData}
							onNodeMouseOver = {this.inspectSkill}
							onNodeMouseOut = {this.uninspect}
						/>
					</div>

					{inspector}
				</div>
			</div>
		);
	}

	/**
	 * Inspect a node and reveal its details
	 * @param {String|Object} node The picked node(s)
	 */
	inspectSkill(node) {
		var nodeData, splitID, nodeObj;

		if (typeof node === 'string') {
			nodeData = this.getNodeDataById(node);
			splitID = node.split('-'),
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
		} else {
			nodeData = this.getNodeDataById(node.id);
			nodeObj = {
				id: node.id,
				type: nodeData.type,
				upgrades: node.upgrades
			};
		}

		this.setState({
			activeNode: nodeObj
		});
	}

	/**
	 * Stop inspecting skills
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
	 * Return the data of a particular node by ID
	 * @param {String} id The node ID
	 * @return {Object|null} The node data
	 */
	getNodeDataById(id) {
		var i, len, nodeData = null;

		for (i = 0, len = this.state.nodeData.length; i < len; i++) {
			if (this.state.nodeData[i].id === id) {
				nodeData = this.state.nodeData[i];
				break;
			}
		}

		return nodeData;
	}
}
