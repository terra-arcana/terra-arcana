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
				'people' => array(
					'key' => 'field_57104df0823d3'
				),
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
				),
				'capabilities' => array(
					'publish_posts' 	=> 'publish_characters',
					'edit_post' 		=> 'edit_character',
					'delete_post' 		=> 'delete_character'
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

			register_rest_field($this->_postTypeName, 'starting_skill', array(
				'update_callback' => array($this, 'initialize_character')
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
				$node_perk_points = 0;
				$bonus_perk_points = intval(get_field($this->bonus_perk_key, $object['id']));

				// Sum all perk points from the character build
				$character_build = get_field($this->_fields['current_build']['key'], $object['id']);
				if (is_array($character_build)) {
					foreach ($character_build as $character_skill) {
						if ($character_skill['type'] == 'perk') {
							$node_perk_points += intval(get_field('value', $character_skill['id']));
						}
					}
				}

				return array(
					'total' => $node_perk_points + $bonus_perk_points,
					'nodes' => $node_perk_points,
					'bonus' => $bonus_perk_points
				);
			}
		}

		/**
		 * Initializes a new character's build with a starter skill.
		 * @param mixed $value The value of the field
		 * @param WP_Post $object The object from the response
		 * @param string $field_name Name of field
		 */
		public function initialize_character($starting_skill, $object, $field_name) {
			$starting_build = array(
				array(
					'id' => $starting_skill,
					'type' => 'skill',
					'perks' => false
				)
			);

			// Add all automatic skills to the build
			$auto_skills = get_field('auto_skills', 'option');
			foreach($auto_skills as $skill) {
				$starting_build[] = array(
					'id' => $skill['skill']->ID,
					'type' => 'skill',
					'perks' => false
				);
			}

			// Set starting build
			update_field($this->_fields['current_build']['key'], $starting_build, $object->ID);

			// Set character as active character
			update_field('active_character', $object->ID, 'user_' . get_current_user_id());
		}
	}
}
