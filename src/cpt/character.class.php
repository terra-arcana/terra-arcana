<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	class Character extends CPT {

		/**
		 * The ACF key for the `bonus_xp` field
		 * @var string
		 */
		private $bonus_xp_key = 'field_5701f339be277';

		/**
		 * The ACF key for the `bonus_perk` field
		 * @var string
		 */
		private $bonus_perk_key = 'field_5701f381be278';

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

		/**
		 * @override
		 */
		public function register_fields() {
			parent::register_fields();

			// Custom fields
			register_rest_field($this->_postTypeName, 'xp', array(
				'get_callback' => array($this, 'get_xp')
			));

			register_rest_field($this->_postTypeName, 'perk_points', array(
				'get_callback' => array($this, 'get_perk_points')
			));
		}

		/**
		 * Callback for the `xp` custom REST field.
		 * @param array $object Details of current post.
		 * @param string $field_name Name of field.
		 * @param WP_REST_Request $request The current request
		 * @param string $post_type The post type
		 * @return Array The character's XP values
		 */
		public function get_xp(array $object, $field_name, \WP_REST_Request $request, $post_type) {
			if (function_exists('get_field')) {
				$base_xp = 8;
				$xp_from_user = 0;
				$xp_from_events = 0;
				$bonus_xp = intval(get_field($this->bonus_xp_key, $object['id']));

				return array(
					'total' => $base_xp + $xp_from_user + $xp_from_events + $bonus_xp,
					'base' => $base_xp,
					'from_user' => $xp_from_user,
					'from_events' => $xp_from_events,
					'bonus' => $bonus_xp
				);
			}
		}

		/**
		 * Callback for the `perk_points` custom REST field.
		 * @param array $object Details of current post.
		 * @param string $field_name Name of field.
		 * @param WP_REST_Request $request The current request
		 * @param string $post_type The post type
		 * @return Array The character's perk point values
		 */
		public function get_perk_points(array $object, $field_name, \WP_REST_Request $request, $post_type) {
			if (function_exists('get_field')) {
				$base_perk_points = 0;
				$bonus_perk_points = intval(get_field($this->bonus_perk_key, $object['id']));

				return array(
					'total' => $base_perk_points + $bonus_perk_points,
					'base' => $base_perk_points,
					'bonus' => $bonus_perk_points
				);
			}
		}
	}
}
