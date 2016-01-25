<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php' );

	/**
	 * Represents the Rules CPT, where the rules of the game 
	 * system can be added to the game database
	 */
	class Rules extends CPT {

		public function __construct() {
			$this->_postTypeName = 'rules';
		}

		private function __clone() {}

		/**
		 * @inheritdoc
		 */
		public function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Pages de règlements',
					'singular_name' 	=> 'Page de règlements',
					'menu_name' 		=> 'Système de jeu',
					'all_items' 		=> 'Pages de règlements',
					'add_new'			=> 'Ajouter une page de règlements',
					'add_new_item'		=> 'Ajouter une page de règlements',
					'edit_item' 		=> 'Modifier la page de règlements',
					'new_item' 			=> 'Nouvelle page de règlements',
					'view_item' 		=> 'Voir la page de règlements',
					'search_items' 		=> 'Rechercher les compétences',
					'not_found' 		=> 'Aucune page de règlements trouvée',
					'not_found_in_trash' => 'Aucune page de règlements trouvée dans la corbeille'
				),
				'rewrite' 				=> array(
					'slug' 					=> 'systeme'
				),
				'menu_icon' 			=> 'dashicons-clipboard',
				'description' 			=> 'Pages de règlements du système de jeu',
				'show_in_menu' 			=> true,
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'reglement',
				'public' 				=> true,
				'hierarchical' 			=> true,
				'supports' => array(
					'title',
					'editor'
				)
			));
		}
	}
}
