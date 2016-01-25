<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php' );

	/**
	 * Represents the Energy node CPT, where distinct energy and 
	 * perk nodes can be added to the game system database.
	 */
	class EnergyNode extends CPT {
		
		public function __construct() {
			$this->_postTypeName = 'energy-node';
			$this->_fields = array(
				'node_type' => array(
					'key' => 'field_56a663aef4f97',
					'select' => true
				),
				'value' => array(
					'key' => 'field_56a663d7f4f98'
				),
				'graph_data' => array(
					'key' => 'field_566f2d31054d9'
				)
			);
		}

		private function __clone() {}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Noeuds d\'énergie',
					'singular_name' 	=> 'Noeud d\'énergie',
					'menu_name' 		=> 'Noeuds d\'énergie',
					'all_items' 		=> 'Noeuds d\'énergie',
					'add_new'			=> 'Ajouter un noeud d\'énergie',
					'add_new_item'		=> 'Ajouter un noeud d\'énergie',
					'edit_item' 		=> 'Modifier le noeud d\'énergie',
					'new_item' 			=> 'Nouveau noeud d\'énergie',
					'view_item' 		=> 'Voir le noeud d\'énergie',
					'search_items' 		=> 'Rechercher les noeuds d\'énergie',
					'not_found' 		=> 'Aucun noeud d\'énergie trouvé',
					'not_found_in_trash' => 'Aucun noeud d\'énergie trouvé dans la corbeille'
				),
				'rewrite' 				=> array(
					'slug' 					=> 'energie'
				),
				'menu_icon' 			=> 'dashicons-heart',
				'description' 			=> 'Noeuds d\'énergie et d\'essence présents dans le Zodiaque',
				'public' 				=> true,
				'show_in_menu' 			=> 'edit.php?post_type=rules',
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'energy-node',
				'hierarchical' 			=> false,
				'supports' => array(
					'title' => true,
					'editor' => true
				)
			));
		}
		
		/**
		 * Return all skill graph data
		 * @return array The graph data
		 */
		public function get_graph_data() {
			$result = array(
				'nodes' => array(),
				'links' => array()
			);
			
			$energyNodes = get_posts(array(
				'post_type' => 'energy-node',
				'posts_per_page' => -1
			));

			foreach($energyNodes as $node) {
				$graphData = get_field($this->_fields['graph_data']['key'], $node->ID);
				$nodeType = get_field($this->_fields['node_type']['key'], $node->ID);
				$value = get_field($this->_fields['value']['key'], $node->ID);

				// Add the skill to the graph data
				array_push($result['nodes'], array(
					'id' => (string)$node->ID,
					'type' => $nodeType,
					'value' => $value,
					'x' => intval($graphData[0]['x']),
					'y' => intval($graphData[0]['y'])
				));

				// Add links to the skill to the graph data
				foreach ($graphData[0]['links'] as $link) {
					array_push($result['links'], array((string)$node->ID, $link['id']));
				}
			}

			return $result;
		}

		/**
		 * Update a graph data node (X/Y coordinates and link IDs)
		 * @param Object $node An object containing the new `x`, `y` and `links` properties of a node `id`
		 */
		public function update_graph_data($node) {
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'x'), $node['x'], $node['id']);
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'y'), $node['y'], $node['id']);

			// TODO: Update links
		}
	}
}
