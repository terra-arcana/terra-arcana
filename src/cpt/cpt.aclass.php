<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {
		/**
		 * @name CPT
		 * @desc Represents a custom post type model
		 */
		abstract class CPT extends \WP_REST_Controller {

			/**
			 * @name init
			 * @desc Runs on WP init hook
			 */
			public function init() {
				$this->register_post_type();

				add_action( 'rest_api_init', array($this, 'register_routes') );
			}

			/**
			 * @name register_post_type
			 * @desc Register the WordPress custom post type in the database
			 */
			abstract public function register_post_type();
		}
	}
}
