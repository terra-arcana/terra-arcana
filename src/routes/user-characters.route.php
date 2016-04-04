<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		/**
		 * The UserCharactersRoute lists all characters owned by a particular user. It is accessible
		 * at `wp/v2/users/<user_id>/characters`.
		 */
		class UserCharactersRoute extends \WP_REST_Controller {

			public function register_routes() {
				register_rest_route('/wp/v2', '/users/(?P<user_id>\d+)/characters', array(
					array(
						'methods' => \WP_REST_Server::READABLE,
						'callback' => array($this, 'get_characters')
					)
				));
			}

			/**
			 * Get all characters of a user
			 * @param WP_REST_Request $request The current request
			 * @return Array|WP_Error
			 */
			public function get_characters($request) {
				$user_id = $request->get_url_params()['user_id'];

				$characters = get_posts(array(
					'post_type' => 'character',
					'author' => $user_id,
					'posts_per_page' => -1,
				));

				return $characters;
			}
		}
	}
}
