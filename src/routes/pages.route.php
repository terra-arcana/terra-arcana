<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		/**
		 * The PagesRoute lists the ids for special static pages used throughout the entire site.
		 */
		class PagesRoute extends \WP_REST_Controller {

			/**
			 * ACF keys for custom fields
			 * @var Array<string>
			 */
			private $_pageFields = array(
				'home' => 'field_58992e4cc5c0b'
			);

			public function register_routes() {
				register_rest_route(API_PREFIX . '/v1', '/pages', array(
					array(
						'methods' => \WP_REST_Server::READABLE,
						'callback' => array($this, 'get_items')
					)
				));
			}

			/**
			 * Get all page items
			 * @param WP_REST_Request $request The current request
			 * @return Array|WP_Error
			 */
			public function get_items($request) {
				$result = array();

				foreach ($this->_pageFields as $key => $acf_key) {
					$result[$key] = get_field($acf_key, 'option');
				}

				return $result;
			}
		}
	}
}
