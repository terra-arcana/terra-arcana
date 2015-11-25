<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {
		require_once(ROOT . '/src/cpt/cpt.aclass.php' );

		/**
		 * @name Codex
		 * @desc Represents the Codex CPT, where lore articles can be added to the
		 * game database
		 */
		class Codex extends CPT {

			public function __construct() {}
			private function __clone() {}

			/**
			 * @inheritdoc
			 */
			public function register_post_type() {
				register_post_type('codex', array(
					'labels' => array(
						'name' 				=> 'Codex Arcanum',
						'singular_name' 	=> 'Page du Codex',
						'menu_name' 		=> 'Codex Arcanum',
						'all_items' 		=> 'Toutes les pages du Codex',
						'add_new_item' 		=> 'Ajouter une nouvelle page',
						'edit_item' 		=> 'Modifier la page du Codex',
						'new_item' 			=> 'Nouvelle page du Codex',
						'view_item' 		=> 'Voir la page du Codex',
						'search_items' 		=> 'Rechercher dans le Codex',
						'not_found' 		=> 'Aucune page du Codex trouvée',
						'not_found_in_trash' => 'Aucune page du Codex trouvée dans la corbeille'
					),
					'menu_icon' 			=> 'dashicons-book',
					'description' 			=> 'Le Codex Arcanum, recensement de l\'histoire du monde de Terra Arcana',
					'public' 				=> true,
					'hierarchical' 			=> false,
					'supports' => array(
						'title',
						'editor',
						'author',
						'thumbnail',
						'excerpt',
						'custom-fields'
					)
				));
			}

			/**
			 * @inheritdoc
			 */
			public function register_routes() {
				register_rest_route( API_PREFIX . '/v1', '/codex', array(
	        		'methods' => 'GET',
	        		'callback' => array($this, 'all')
	    		) );

				register_rest_route( API_PREFIX . '/v1', '/codex/(?P<id>\d+)', array(
					'methods' => 'GET',
					'callback'	=> array($this, 'get'),
					'args' => array(
						'id' => array(
							'validate_callback' => 'is_numeric'
						),
					)
				) );
			}

			/**
			 * @name   all
			 * @desc   Get all Codex articles
			 * @param  WP_REST_Request $request The REST API request
			 * @return WP_Post[]                An array of all Codex articles
			 */
			public function all(\WP_REST_Request $request) {
				$articles = get_posts( array(
					'post_type' => 'codex',
					'posts_per_page' => -1
				) );

				if ( empty( $articles ) ) {
					return new \WP_Error( 'terraarcana_no_codex_articles', 'Aucun article du Codex trouvé', array( 'status' => 404 ) );
				}

				return $articles;
			}

			/**
			 * @name   get
			 * @desc   Get a Codex article by id
			 * @param  WP_REST_Request $request The REST API request
			 * @return WP_Post[]                An array containing a single Codex article
			 */
			public function get(\WP_REST_Request $request) {
				$articles = get_posts( array(
					'p' => $request['id'],
					'post_type' => 'codex'
				) );

				if ( empty( $articles ) ) {
					return new \WP_Error( 'terraarcana_no_codex_articles', 'Aucun article du Codex trouvé', array( 'status' => 404 ) );
				}

				return $articles;
			}
		}
	}
}
