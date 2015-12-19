<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {
		require_once(ROOT . '/src/cpt/cpt.aclass.php' );

		/**
		 * Represents the Skill CPT, where character skills can be added to the
		 * game database
		 */
		class Skill extends CPT {

			public function __construct() {
				$this->postTypeName = 'skill';
				$this->fields = array(
					'effect' => array(
						'key' => 'field_566f24d16f2b3'
					),
					'flavor-text' => array(
						'key' => 'field_566f24f36f2b4'
					),
					'upgrades' => array(
						'key' => 'field_566f2c49054d1'
					),
					'graph-data' => array(
						'key' => 'field_566f2d31054d9'
					),
					'skill-type' => array(
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
				register_post_type($this->postTypeName, array(
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
				register_rest_route(API_PREFIX . '/v1', '/metadata/skill', array(
					'methods' => 'GET',
					'callback' => array($this, 'custom_field_metadata')
				));
			}

			/**
			 * Return all custom field metadata related to skills
			 * 
			 * @param WP_REST_Request $request The current request
			 * @return array The metadata
			 */
			public function custom_field_metadata(\WP_REST_Request $request) {
				$result = array_merge(
					acf_get_fields_by_id(13), 
					acf_get_fields_by_id(82)
				);

				if (empty($result)) {
					return new \WP_Error('terraarcana_no_field_data', 'Aucun champ trouvé', array('status' => 404));
				}

				return $result;
			}
		}
	}
}
