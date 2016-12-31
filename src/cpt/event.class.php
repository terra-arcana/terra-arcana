<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	/**
	 * Represents the Event CPT, which represents a single LARP event within a
	 * campaign.
	 */
	class Event extends CPT {

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
				),
				'date' => array(
					'key' => 'field_5866c69c4b0d6',
					'override' => array(
						'start' => array(
							'key' => 'field_5866c6b24b0d7'
						),
						'end' => array(
							'key' => 'field_5866c6cf4b0d8'
						)
					)
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
	}
}
