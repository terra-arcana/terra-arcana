<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {
		require_once(ROOT . '/src/cpt/cpt.aclass.php' );

		/**
		 * Represents the Skill CPT, where character skills can be added to the
		 * game database.
		 * NOTE: Skill upgrade IDs are one-indexed! This means the second upgrade 
		 * to a skill has id XX-2, and not XX-1.
		 */
		class Skill extends CPT {

			public function __construct() {
				$this->_postTypeName = 'skill';
				$this->_fields = array(
					'effect' => array(
						'key' => 'field_566f24d16f2b3'
					),
					'flavor_text' => array(
						'key' => 'field_566f24f36f2b4'
					),
					'upgrades' => array(
						'key' => 'field_566f2c49054d1'
					),
					'graph_data' => array(
						'key' => 'field_566f2d31054d9'
					),
					'skill_type' => array(
						'key' => 'field_566f1505b9255',
						'select' => true
					),
					'cost' => array(
						'key' => 'field_566f2786a877f',
						'override' => array(
							'ingredients' => array(
								'override' => array(
									'ingredient' => array(
										'key' => 'field_566f2953a8783',
										'select' => true
									)
								)
							)
						)
					),
					'uses' => array(
						'key' => 'field_56705fcc6bc59',
						'override' => array(
							'type' => array(
								'key' => 'field_56705ff76bc5b',
								'select' => true
							)
						)
					),
					'cast' => array(
						'key' => 'field_566f2273ae87f',
						'select' => true
					),
					'duration' => array(
						'key' => 'field_566f20f65025c',
						'select' => true
					),
					'range' => array(
						'key' => 'field_566f260724373',
						'select' => true
					),
					'perks' => array(
						'key' => 'field_566f2e297ce74'
					)
				);
			}

			private function __clone() {}

			/**
			 * @inheritdoc
			 */
			public function register_post_type() {
				register_post_type($this->_postTypeName, array(
					'labels' => array(
						'name'				=> 'Compétences',
						'singular_name' 	=> 'Compétence',
						'menu_name' 		=> 'Compétences',
						'all_items'			=> 'Compétences',
						'add_new'			=> 'Ajouter une compétence',
						'add_new_item'		=> 'Ajouter une compétence',
						'edit_item' 		=> 'Modifier la compétence',
						'new_item' 			=> 'Nouvelle compétence',
						'view_item' 		=> 'Voir la compétence',
						'search_items' 		=> 'Rechercher les compétences',
						'not_found' 		=> 'Aucune compétence trouvée',
						'not_found_in_trash' => 'Aucune compétence trouvée dans la corbeille'
					),
					'rewrite' 				=> array(
						'slug' 					=> 'competence'
					),
					'menu_icon' 			=> 'dashicons-shield-alt',
					'description' 			=> 'Compétences du système de jeu',
					'public' 				=> true,
					'show_in_menu' 			=> 'edit.php?post_type=rules',
					'show_in_rest' 			=> true,
					'rest_base' 			=> 'skill',
					'hierarchical' 			=> false,
					'supports' => array(
						'title'
					)
				));
			}

			/** 
			 * @inheritdoc
			 */
			public function register_rest_data() {
				register_rest_route(API_PREFIX . '/v1', '/skill/graph-data', array(
					'methods' => 'GET',
					'callback' => array($this, 'graph_data')
				));
			}

			/**
			 * Return all skill graph data
			 * @param WP_REST_Request $request The current request
			 * @return array The graph data
			 */
			public function graph_data(\WP_REST_Request $request) {
				$result = array(
					'nodes' => array(),
					'links' => array()
				);
				
				$skills = get_posts(array(
					'post_type' => 'skill',
					'posts_per_page' => -1
				));

				// Exit early if no skills are found
				if (empty($skills)) {
					return new \WP_Error('terraarcana_no_field_data', 'Aucun champ trouvé', array('status' => 404));
				}

				foreach($skills as $skill) {
					$skillGraphData = get_field('field_566f2d31054d9', $skill->ID);

					// Add the skill to the graph data
					array_push($result['nodes'], array(
						'id' => (string)$skill->ID,
						'type' => 'skill',
						'x' => intval($skillGraphData[0]['x']),
						'y' => intval($skillGraphData[0]['y'])
					));

					// Add links to the skill to the graph data
					if ($skillGraphData[0]['links']) {
						foreach ($skillGraphData[0]['links'] as $link) {
							$this->push_unique_link($result['links'], (string)$skill->ID, $link['id']);
						}
					}

					// Add any upgrades to the graph data
					$skillUpgrades = get_field('field_566f2c49054d1', $skill->ID);

					if ($skillUpgrades) {
						for ($i = 0; $i < count($skillUpgrades); $i++) {
							$upgrade = $skillUpgrades[$i];
							$upgradeID = (string)$skill->ID . '-' . (string)($i+1); // Ensure one-indexation of skill upgrades

							array_push($result['nodes'], array(
								'id' => $upgradeID,
								'type' => 'upgrade',
								'x' => intval($upgrade['graph_data'][0]['x']),
								'y' => intval($upgrade['graph_data'][0]['y'])
							));

							// Add any links from the upgrades to the graph data
							if ($upgrade['graph_data'][0]['links']) {
								foreach ($upgrade['graph_data'][0]['links'] as $link) {
									$this->push_unique_link($result['links'], $upgradeID, $link['id']);
								}
							}
						}
					}
				}

				return $result;
			}

			/**
			 * Adds a skill link to a link array, ensuring there are no duplicates.
			 * @param &array $linkArray The link array containing all current links
			 * @param string $from The first link element
			 * @param string $to The second link element
			 * @return array The new link array
			 */
			private function push_unique_link(array &$linkArray, $from, $to) {
				foreach ($linkArray as $link) {
					// If we find a duplicate, exit eraly before pushing the new link
					if (($link[0] == $from && $link[1] == $to) || 
						($link[0] == $to && $link[1] == $from)) {
						return $linkArray;
					}
				}

				// Push the new link as they were no duplicates
				array_push($linkArray, array($from, $to));
				return $linkArray;
			}
		}
	}
}
