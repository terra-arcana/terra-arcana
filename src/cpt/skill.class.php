<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

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
				'character_class' => array(
					'key' => 'field_56bf9ccd4d4e3'
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
				),
				'starting_skill' => array(
					'key' => 'field_57235889039c9'
				)
			);
		}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
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
		 * Return all skill graph data
		 * @return array The graph data
		 */
		public function get_graph_data() {
			$result = array(
				'nodes' => array(),
				'links' => array()
			);

			$skills = get_posts(array(
				'post_type' => 'skill',
				'posts_per_page' => -1
			));

			foreach ($skills as $skill) {
				$skillGraphData = get_field($this->_fields['graph_data']['key'], $skill->ID);
				$skillPerkData = get_field($this->_fields['perks']['key'], $skill->ID);

				// Prepare perk data
				if (is_array($skillPerkData)) {
					$skillPerkData = $skillPerkData[0];
					foreach ($skillPerkData as &$perkProp) {
						$perkProp = intval($perkProp);
					}
				}

				// Add the skill to the graph data
				array_push($result['nodes'], array(
					'id' => (string)$skill->ID,
					'name' => $skill->post_title,
					'type' => 'skill',
					'x' => intval($skillGraphData[0]['x']),
					'y' => intval($skillGraphData[0]['y']),
					'start' => $skillGraphData[0]['start'],
					'perks' => $skillPerkData
				));

				// Add links to the skill to the graph data
				if (is_array($skillGraphData[0]['links'])) {
					foreach ($skillGraphData[0]['links'] as $link) {
						array_push($result['links'], array((string)$skill->ID, $link['id']));
					}
				}

				// Add any upgrades to the graph data
				$skillUpgrades = get_field($this->_fields['upgrades']['key'], $skill->ID);

				if ($skillUpgrades) {
					for ($i = 0; $i < count($skillUpgrades); $i++) {
						$upgrade = $skillUpgrades[$i];
						$upgradeID = (string)$skill->ID . '-' . (string)($i+1); // Ensure one-indexation of skill upgrades

						array_push($result['nodes'], array(
							'id' => $upgradeID,
							'name' => $upgrade['title'],
							'type' => 'upgrade',
							'x' => intval($upgrade['graph_data'][0]['x']),
							'y' => intval($upgrade['graph_data'][0]['y'])
						));

						// Add any links from the upgrades to the graph data
						if (array_key_exists(0, $upgrade['graph_data'])) {
							if (is_array($upgrade['graph_data'][0]['links'])) {
								foreach ($upgrade['graph_data'][0]['links'] as $link) {
									array_push($result['links'], array($upgradeID, $link['id']));
								}
							}
						}
					}
				}
			}

			return $result;
		}

		/**
		 * Update a graph data skill node (X/Y coordinates and link IDs)
		 * @param Object $node An object containing the new `x`, `y`, `start` and `links` properties of a node `id`
		 * @param array $links The IDs of the nodes linked to this skill
		 */
		public function update_skill_graph_data($node, $links) {
			$acfLinks = array();
			foreach($links as $link) {
				$acfLinks[] = array(
					'id' => $link
				);
			}

			// Update coordinates
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'x'), $node['x'], $node['id']);
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'y'), $node['y'], $node['id']);

			// Update links
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'links'), $acfLinks, $node['id']);

			// Update start node status
			update_sub_field(array($this->_fields['graph_data']['key'], 1, 'start'), ($node['start'] === 'true'), $node['id']);
		}

		/**
		 * Update a graph data upgrade node (X/Y coordinates and link IDs)
		 * @param Object $node An object containing the new `x`, `y` and `links` properties of a node `id`
		 * @param array $links The IDs of the nodes linked to this skill
		 */
		public function update_upgrade_graph_data($node, $links) {
			$acfLinks = array();
			foreach($links as $link) {
				$acfLinks[] = array(
					'id' => $link
				);
			}

			$idFragments = explode('-', $node['id']);

			// Update coordinates
			update_sub_field(array($this->_fields['upgrades']['key'], $idFragments[1], 'graph_data', 1, 'x'), $node['x'], $idFragments[0]);
			update_sub_field(array($this->_fields['upgrades']['key'], $idFragments[1], 'graph_data', 1, 'y'), $node['y'], $idFragments[0]);

			// Update links
			update_sub_field(array($this->_fields['upgrades']['key'], $idFragments[1], 'graph_data', 1, 'links'), $acfLinks, $idFragments[0]);
		}
	}
}
