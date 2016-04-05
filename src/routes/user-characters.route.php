<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		/**
		 * The UserCharactersRoute lists all characters owned by a particular user. It is accessible
		 * at `wp/v2/users/<user_id>/characters`.
		 */
		class UserCharactersRoute extends \WP_REST_Posts_Controller {

			public function register_routes() {
				register_rest_route($this->namespace, '/users/(?P<author>\d+)/characters', array(
					array(
						'methods' => \WP_REST_Server::READABLE,
						'callback' => array($this, 'get_items'),
						'permission_callback' => array($this, 'get_items_permissions_check'),
						'args' => $this->get_collection_params(),
					)
				));
			}
		}
	}
}
