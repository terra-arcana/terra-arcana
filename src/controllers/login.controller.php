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
		}

		/**
		 * Enqueues custom styles and scripts on the default WordPress login page
		 */
		public function login_enqueue_scripts() {
			?>
				<style type='text/css'>
					.login h1 a {
						background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/dist/images/terra-login-logo.png);
						background-size: contain;
						width: auto;
					}
				</style>
			<?php
		}
	}
}
