<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the People CPT, where the lore of each different playable race
	 * is stored
	 */
	class People extends CPT {

		public function __construct() {
			$this->_postTypeName = 'people';
			$this->_fields = array(
				'singular' => array(
					'key' => 'field_571051496395a'
				),
				'playable' => array(
					'key' => 'field_57104cdac3f2d'
				)
			);
		}

		/**
		 * @inheritdoc
		 */
		public function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Peuples',
					'singular_name' 	=> 'Peuple',
					'menu_name' 		=> 'Peuples',
					'all_items' 		=> 'Peuples',
					'add_new'			=> 'Ajouter un peuple',
					'add_new_item'		=> 'Ajouter un peuple',
					'edit_item' 		=> 'Modifier le peuple',
					'new_item' 			=> 'Nouveau peuple',
					'view_item' 		=> 'Voir le peuple',
					'search_items' 		=> 'Rechercher les peuples',
					'not_found' 		=> 'Aucune peuple trouvé',
					'not_found_in_trash' => 'Aucun peuple trouvé dans la corbeille'
				),
				'rewrite' 				=> array(
					'slug' 					=> 'peuple'
				),
				'menu_icon' 			=> 'dashicons-clipboard',
				'description' 			=> 'Peuples du monde de Terra Arcana',
				'show_in_menu' 			=> 'edit.php?post_type=codex',
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'people',
				'public' 				=> true,
				'hierarchical' 			=> true,
				'supports' => array(
					'title',
					'editor',
					'excerpt'
				)
			));
		}
	}
}
