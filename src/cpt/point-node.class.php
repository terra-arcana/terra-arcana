<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php' );

	/**
	 * Represents the point node CPT, where distinct energy and 
	 * perk nodes can be added to the game system database.
	 */
	class PointNode extends CPT {
		
		public function __construct() {
			$this->_postTypeName = 'point-node';
			$this->_fields = array(
				'node_type' => array(
					'key' => 'field_56a663aef4f97',
					'select' => true
				),
				'value' => array(
					'key' => 'field_56a663d7f4f98'
				),
				'graph_data' => array(
					'key' => 'field_566f2d31054d9',
					'x' => array(
						'key' => 'field_566f2d72054db'
					),
					'y' => array(
						'key' => 'field_566f2d7b054dc'
					),
					'start' => array(
						'key' => 'field_56d12cd71e05e'
					)
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
				'show_in_rest' 			=> false,
				'hierarchical' 			=> false,
				'supports' => array(
					'title' => false,
					'editor' => false
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
			
			$pointNodes = get_posts(array(
				'post_type' => 'point-node',
				'posts_per_page' => -1
			));

			foreach($pointNodes as $node) {
				$graphData = get_field($this->_fields['graph_data']['key'], $node->ID);
				$nodeType = get_field($this->_fields['node_type']['key'], $node->ID);
				$value = get_field($this->_fields['value']['key'], $node->ID);

				// Add the skill to the graph data
				array_push($result['nodes'], array(
					'id' => (string)$node->ID,
					'type' => $nodeType,
					'x' => intval($graphData[0]['x']),
					'y' => intval($graphData[0]['y']),
					'start' => $graphData[0]['start'],
					'value' => $value,
				));

				// Add links to the skill to the graph data
				if (!empty($graphData[0]['links'])) {
					foreach ($graphData[0]['links'] as $link) {
						array_push($result['links'], array((string)$node->ID, $link['id']));
					}					
				}
			}

			return $result;
		}

		/**
		 * Create a new point node in the database. 
		 * This does not create any custom fields, use {@link update_graph_data} afterwards.
		 * @param array $data The new node data
		 * @return int The ID of the inserted WordPress node
		 */
		public function create($data) {
			$id = -1;
			$choices = get_field_object($this->_fields['node_type']['key'])['choices'];
			$post_title = $choices[$data['type']];
			$post_content = '';

			while (have_rows('point_nodes', 'option')) {
				the_row();
				while (have_rows('post_content')) {
					the_row();
					$post_content = get_sub_field($data['type']);
				}
			}

			$id = wp_insert_post(array(
				'post_type' => $this->_postTypeName,
				'post_title' => $post_title,
				'post_content' => $post_content,
				'post_status' => 'publish'
			));

			// Create stub graph_data repeater row so it will be ready for update_graph_data, 
			// since that function can't handle creating new rows
			// @see http://www.advancedcustomfields.com/resources/update_sub_field/
			add_row($this->_fields['graph_data']['key'], array(
				'x' => 0,
				'y' => 0,
				'links' => array()
			), $id);

			return $id;
		}

		/**
		 * Update a graph data node (X/Y coordinates and link IDs). At this point, 
		 * all nodes entering here should already exist in DB
		 * @param Object $node An object containing the new `x`, `y` and `links` properties of a node `id`
		 * @param array $links The IDs of the nodes linked to this skill
		 */
		public function update_graph_data($node, $links) {
			$acfLinks = array();
			foreach($links as $link) {
				$acfLinks[] = array(
					'id' => $link
				);
			}

			// Update point node values
			update_field($this->_fields['node_type']['key'], $node['type'], $node['id']);
			update_field($this->_fields['value']['key'], $node['value'], $node['id']);
			
			// Update coordinates
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'x'), $node['x'], $node['id']);
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'y'), $node['y'], $node['id']);

			// Update links
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'links'), $acfLinks, $node['id']);
		}
	}
}
