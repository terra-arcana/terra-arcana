<?php

namespace terraarcana {
	require_once(ROOT . '/src/controllers/controller.aclass.php');

	/**
	 * Handles the authentication modules
	 */
	class LoginController extends Controller {

		public function __construct() {
			parent::__construct();
		}

		private function __clone() {}

		/**
		 * @override
		 */
		public function init() {
			add_action('login_enqueue_scripts', array($this, 'login_enqueue_scripts'));
			add_filter('login_redirect', array($this, 'login_redirect'));
		}

		/**
		 * Enqueues custom styles and scripts on the default WordPress login page
		 */
		public function login_enqueue_scripts() {
			wp_enqueue_style('ta-login', get_stylesheet_directory_uri() . '/dist/login.css');
		}

		/**
		 * Redirects the user to the homepage after login
		 */
		public function login_redirect() {
			return home_url();
		}
	}
}
