<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the Rules CPT, where the rules of the game
	 * system can be added to the game database
	 */
	class Rules extends CPT {

		public function __construct() {
			$this->_postTypeName = 'rules';
		}

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
				'rest_base' 			=> 'rules',
				'public' 				=> true,
				'hierarchical' 			=> true,
				'supports' => array(
					'title',
					'editor'
				)
			));

			register_taxonomy('sections', $this->_postTypeName, array(
				'hierarchical' 			=> true,
				'labels' => array(
					'name'				=> 'Sections',
					'singular_name' 	=> 'Section',
					'search_items' 		=> 'Rechercher les sections',
					'all_items' 		=> 'Toutes les sections',
					'parent_item' 		=> 'Section parente',
					'parent_item_colon' => null,
					'edit_item' 		=> 'Modifier la section',
					'update_item' 		=> 'Mettre à jour la section',
					'add_new_item' 		=> 'Ajouter une nouvelle section',
					'new_item_name' 	=> 'Nom de la nouvelle section',
					'menu_name' 		=> 'Sections de règlements',
				),
				'show_ui' 				=> true,
				'show_admin_column' 	=> true,
				'query_var' 			=> true,
				'rewrite' 				=> array('slug' => 'section')
			));
		}
	}
}
