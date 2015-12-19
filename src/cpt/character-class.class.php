<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {
		require_once(ROOT . '/src/cpt/cpt.aclass.php' );

		/**
		 * Represents the CharacterClass CPT, where character classes  
		 * can be added to the game database
		 */
		class characterClass extends CPT {

			public function __construct() {
				$this->postTypeName = 'character-class';
			}

			private function __clone() {}

			/**
			 * @inheritdoc
			 */
			public function register_post_type() {
				register_post_type($this->postTypeName, array(
					'labels' => array(
						'name' 				=> 'Zodiaques',
						'singular_name' 	=> 'Zodiaque',
						'menu_name' 		=> 'Zodiaques',
						'all_items' 		=> 'Zodiaques',
						'add_new'	 		=> 'Ajouter un zodiaque',
						'add_new_item'		=> 'Ajouter un zodiaque',
						'edit_item' 		=> 'Modifier le zodiaque',
						'new_item' 			=> 'Nouveau zodiaque',
						'view_item' 		=> 'Voir le zodiaque',
						'search_items' 		=> 'Rechercher les zodiaques',
						'not_found' 		=> 'Aucun zodiaque trouvé',
						'not_found_in_trash' => 'Aucun zodiaque trouvé dans la corbeille'
					),
					'rewrite' 				=> array(
						'slug' 					=> 'zodiaque'
					),
					'menu_icon' 			=> 'dashicons-shield',
					'description' 			=> 'Zodiaques du système de jeu',
					'public' 				=> true,
					'show_in_menu' 			=> 'edit.php?post_type=rules',
					'show_in_rest' 			=> true,
					'rest_base' 			=> 'zodiaque',
					'hierarchical' 			=> false,
					'supports' => array(
						'title',
						'editor'
					)
				));
			}
		}
	}
}
