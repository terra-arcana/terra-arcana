<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the Event CPT, which represents a single LARP event within a
	 * campaign.
	 */
	class Event extends CPT {

		/**
		 * The ACF key for the `date` field
		 * @var string
		 */
		private $date_key = 'field_5866c69c4b0d6';		

		/**
		 * The ACF key for the `date/start` field
		 * @var string
		 */
		private $start_date_key = 'field_5866c6b24b0d7';

		/**
		 * The ACF key for the `date/end` field
		 * @var string
		 */
		private $end_date_key = 'field_5866c6cf4b0d8';

		public function __construct() {
			$this->_postTypeName = 'event';
			$this->_fields = array(
				'attendees' => array(
					'key' => 'field_5866c62240dd4',
					'override' => array(
						'player' => array(
							'key' => 'field_5866c63840dd5'
						),
						'character' => array(
							'key' => 'field_5866c64d40dd6'
						)
					)
				),
				'pictures' => array(
					'key' => 'field_5866c84f25c29'
				),
				'campaign' => array(
					'key' => 'field_5866b9ef3f073'
				)
			);

			add_filter('post_type_link', array($this, 'campaign_rewrite_slug'), 10, 2);
		}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {
			register_post_type($this->_postTypeName, array(
				'labels' => array(
					'name'               => 'Grandeurs Nature',
					'singular_name'      => 'Grandeur Nature',
					'menu_name'          => 'Grandeurs Nature',
					'all_items'          => 'Grandeurs Nature',
					'add_new'            => 'Ajouter un GN',
					'add_new_item'       => 'Ajouter un GN',
					'edit_item'          => 'Modifier le GN',
					'new_item'           => 'Nouveau GN',
					'view_item'          => 'Voir le GN',
					'search_items'       => 'Rechercher dans les GNs',
					'not_found'          => 'Aucun GN trouvé',
					'not_found_in_trash' => 'Aucun GN trouvé dans la corbeille'
				),
				'rewrite'              => array(
					'slug'               => 'campagne%campaign_name%',
					'with_front'         => true
				),
				'description'          => 'Les GNs de Terra Arcana',
				'public'               => true,
				'show_in_menu'         => 'edit.php?post_type=campaign',
				'show_in_rest'         => true,
				'rest_base'            => 'event',
				'hierarchical'         => false,
				'supports' => array(
					'title',
					'editor'
				)
			));
		}

		/**
		 * @override
		 */
		public function register_fields() {
			parent::register_fields();

			register_rest_field($this->_postTypeName, 'date', array(
				'get_callback' => array($this, 'get_date')
			));
		}

		/**
		 * Callback for the `date` custom REST field.
		 * @param array $object Details of current post.
		 * @param string $field_name Name of field.
		 * @param WP_REST_Request $request The current request
		 * @param string $post_type The post type
		 * @return Array The character's XP values
		 */
		public function get_date(array $object, $field_name, \WP_REST_Request $request, $post_type) {
			$start_date = 0;
			$end_date = 0;

			while (have_rows($this->date_key, $object['id'])) {
				the_row();

				$start_date = strtotime(get_sub_field($this->start_date_key));
				$end_date = strtotime(get_sub_field($this->end_date_key));
			}

			return array(
				'start' => array(
					'timestamp' => $start_date,
					'rendered' => date_i18n('j F', $start_date)
				),
				'end' => array(
					'timestamp' => $end_date,
					'rendered' => date_i18n('j F Y', $end_date)
				)
			);
		}

		/**
		 * Rewrite the slug on event posts so they are shown as children of their campaign
		 * @param  [string] $link The default link
		 * @param  [WP_Post] $post The post
		 * @return [string] The new link
		 */
		public function campaign_rewrite_slug($link, $post) {
			if (get_post_type($post) == $this->_postTypeName) {
				$campaign = get_field('campaign', $post->ID);
				$replace = '';

				if ($campaign && !empty($campaign->post_name)) {
					$replace = '/' . $campaign->post_name;
				}

				return str_replace('%campaign_name%', $replace, $link);
			}

			return $link;
		}

		/**
		 * Get the amount of events a user has attended.
		 * @param int $user_id The user ID 
		 * @return int The amount of events attended 
		 */
		public function get_event_count_for_user($user_id) {
			$predicate = function() use ($user_id) {
				return ($user_id === get_sub_field($this->_fields['attendees']['override']['player']['key'])['ID']);
			};

			return $this->get_event_attendee_count($predicate);
		}

		/**
		 * Get the amount of events in which a character was present. 
		 * @param int $character_id The character ID 
		 * @return int The amount of events attended
		 */
		public function get_event_count_for_character($character_id) {
			$predicate = function() use ($character_id) {
				return ($character_id === get_sub_field($this->_fields['attendees']['override']['character']['key']));
			};

			return $this->get_event_attendee_count($predicate);
		}

		/**
		 * Get the number of events related to a certain attendee predicate.
		 * @param Callable $predicate Predicate to filter out the result
		 * @return int The amount of events concerned with the predicate
		 */
		private function get_event_attendee_count(callable $predicate) {
			$event_count = 0;
			$query = new \WP_Query(array(
				'post_type' => $this->_postTypeName,
				'posts_per_page' => -1
			));
			$events = $query->posts;

			while ($query->have_posts()) {
				$query->the_post();

				// Skip events that have not yet happened
				$skip = false;
				while (have_rows($this->date_key)) {
					the_row();

					$end_date = strtotime(get_sub_field($this->end_date_key));
					if ($end_date > time()) {
						$skip = true;
					}
				}

				if ($skip) {
					continue;
				}

				// Loop attendees for predicate
				while (have_rows($this->_fields['attendees']['key'])) {
					the_row();

					if ($predicate()) {
						$event_count++;
						continue;
					}
				}
			}
			wp_reset_postdata();

			return $event_count;
		}
	}
}
