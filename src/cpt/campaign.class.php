<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the Campaign CPT, which represents a series of related events
	 * tied together by a cohesive storyline.
	 */
	class Campaign extends CPT {

		public function __construct() {
			$this->_postTypeName = 'campaign';
		}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name'               => 'Campagnes',
					'singular_name'      => 'Campagne',
					'menu_name'          => 'Campagnes',
					'all_items'          => 'Toutes les campagnes',
					'add_new'            => 'Ajouter une campagne',
					'add_new_item'       => 'Ajouter une campagne',
					'edit_item'          => 'Modifier la campagne',
					'new_item'           => 'Nouvelle campagne',
					'view_item'          => 'Voir la campagne',
					'search_items'       => 'Rechercher dans les campagnes',
					'not_found'          => 'Aucune campagne trouvée',
					'not_found_in_trash' => 'Aucune campagne trouvée dans la corbeille'
				),
				'rewrite'              => array(
					'slug'               => 'campagne'
				),
				'menu_icon'            => 'dashicons-book-alt',
				'description'          => 'Les campagnes de Terra Arcana',
				'public'               => true,
				'show_in_rest'         => true,
				'rest_base'            => 'campaign',
				'hierarchical'         => false,
				'supports' => array(
					'title',
					'editor',
					'thumbnail',
					'excerpt'
				)
			));
		}
	}
}
