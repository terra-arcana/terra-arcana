<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		class CampaignEventsRoute extends \WP_REST_Posts_Controller {

			public function register_routes() {
				register_rest_route(API_PREFIX . '/v1', '/campaign-events/(?P<id>\d+)', array(
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

				// Fetch all events
				$request->set_param('per_page', -1);
				$allEvents = parent::get_items($request);

				// Filter all events to only return the ones matching the campaign ID
				foreach($allEvents->data as $event) {
					if ($event['campaign'] == $request['id']) {
						$result[] = $event;
					}
				}

				return $result;
			}
		}
	}
}
