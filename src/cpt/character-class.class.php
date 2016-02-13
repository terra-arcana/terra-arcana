<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php' );

	/**
	 * Represents the CharacterClass CPT, where character classes  
	 * can be added to the game database
	 */
	class CharacterClass extends CPT {

		public function __construct() {
			$this->_postTypeName = 'character-class';
		}

		private function __clone() {}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Signes',
					'singular_name' 	=> 'Signe',
					'menu_name' 		=> 'Signes',
					'all_items' 		=> 'Signes',
					'add_new'	 		=> 'Ajouter un signe',
					'add_new_item'		=> 'Ajouter un signe',
					'edit_item' 		=> 'Modifier le signe',
					'new_item' 			=> 'Nouveau signe',
					'view_item' 		=> 'Voir le signe',
					'search_items' 		=> 'Rechercher les signes',
					'not_found' 		=> 'Aucun signe trouvé',
					'not_found_in_trash' => 'Aucun signe trouvé dans la corbeille'
				),
				'rewrite' 				=> array(
					'slug' 					=> 'signe'
				),
				'menu_icon' 			=> 'dashicons-shield',
				'description' 			=> 'Signes du zodiaque (toile du système de jeu)',
				'public' 				=> true,
				'show_in_menu' 			=> 'edit.php?post_type=rules',
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'character-class',
				'hierarchical' 			=> false,
				'supports' => array(
					'title',
					'editor'
				)
			));
		}
	}
}
