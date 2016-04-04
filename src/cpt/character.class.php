<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	class Character extends CPT {

		public function __construct() {
			$this->_postTypeName = 'character';
			$this->_fields = array(
				'public_description' => array(
					'key' => 'field_5701f211be271'
				),
				'private_description' => array(
					'key' => 'field_5701f1d8be270'
				),
				'current_build' => array(
					'key' => 'field_5701f279be273'
				),
				'last_validated_build' => array(
					'key' => 'field_5701f2f9be275'
				),
				'photo' => array(
					'key' => 'field_5701f25fbe272'
				),
				'bonus_xp' => array(
					'key' => 'field_5701f339be277'
				),
				'bonus_perk' => array(
					'key' => 'field_5701f381be278'
				)
			);
		}

		/**
		 * @override
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Personnages',
					'singular_name' 	=> 'Personnage',
					'menu_name' 		=> 'Personnages',
					'all_items' 		=> 'Personnages',
					'add_new'	 		=> 'Ajouter un personnage',
					'add_new_item'		=> 'Ajouter un personnage',
					'edit_item' 		=> 'Modifier le personnage',
					'new_item' 			=> 'Nouveau personnage',
					'view_item' 		=> 'Voir le personnage',
					'search_items' 		=> 'Rechercher les personnages',
					'not_found' 		=> 'Aucun personnage trouvé',
					'not_found_in_trash' => 'Aucun personnage trouvé dans la corbeille'
				),
				'rewrite' 				=> array(
					'slug' 					=> 'personnage'
				),
				'menu_icon' 			=> 'dashicons-groups',
				'description' 			=> 'Personnages joueurs',
				'public' 				=> true,
				'show_in_menu' 			=> true,
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'character',
				'hierarchical' 			=> false,
				'supports' => array(
					'title',
					'author'
				)
			));
		}
	}
}
