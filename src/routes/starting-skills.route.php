<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		class StartingSkillsRoute extends \WP_REST_Posts_Controller {

			public function register_routes() {
				register_rest_route(API_PREFIX . '/v1', '/starting-skills', array(
					array(
						'methods' => \WP_REST_Server::READABLE,
						'callback' => array($this, 'get_items')
					)
				));
			}

			/**
			 * Get all graph data items
			 * @param WP_REST_Request $request The current request
			 * @return Array|WP_Error
			 */
			public function get_items($request) {
				$result = array();

				// Fetch all skills
				$request->set_param('per_page', -1);
				$allSkills = parent::get_items($request);

				// Filter all skills to only return the ones tagged as starting skills
				foreach($allSkills->data as $skill) {
					if ($skill['starting_skill']) {
						$result[] = $skill;
					}
				}

				return $result;
			}
		}
	}
}
