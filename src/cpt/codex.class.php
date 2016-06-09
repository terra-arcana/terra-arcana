<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the Codex CPT, where lore articles can be added to the
	 * game database
	 */
	class Codex extends CPT {

		public function __construct() {
			$this->_postTypeName = 'codex';
		}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name' 				=> 'Codex Arcanum',
					'singular_name' 	=> 'Page du Codex',
					'menu_name' 		=> 'Codex Arcanum',
					'all_items' 		=> 'Toutes les pages du Codex',
					'add_new'	 		=> 'Ajouter une page',
					'add_new_item'		=> 'Ajouter une page',
					'edit_item' 		=> 'Modifier la page du Codex',
					'new_item' 			=> 'Nouvelle page du Codex',
					'view_item' 		=> 'Voir la page du Codex',
					'search_items' 		=> 'Rechercher dans le Codex',
					'not_found' 		=> 'Aucune page du Codex trouvée',
					'not_found_in_trash' => 'Aucune page du Codex trouvée dans la corbeille'
				),
				'menu_icon' 			=> 'dashicons-book-alt',
				'description' 			=> 'Le Codex Arcanum, recensement de l\'histoire du monde de Terra Arcana',
				'public' 				=> true,
				'show_in_rest' 			=> true,
				'rest_base' 			=> 'codex',
				'hierarchical' 			=> false,
				'supports' => array(
					'title',
					'editor',
					'author',
					'thumbnail',
					'excerpt'
				)
			));
		}
	}
}
