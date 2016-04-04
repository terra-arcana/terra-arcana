<?php

namespace terraarcana {
	require_once(ROOT . '/src/controllers/controller.aclass.php');

	/**
	 * Handles the queuing of public scripts
	 */
	class ScriptController extends Controller {

		public function __construct() {
			parent::__construct();
		}

		private function __clone() {}

		/**
		 * @override
		 */
		public function init() {
			add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
			add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
		}

		/**
		 * Enqueue all public app scripts
		 */
		public function enqueue_scripts() {
			$base = get_stylesheet_directory_uri() . '/';

			if (isset($_GET['debug'])) {
				wp_register_script('bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.js', array('jquery'));

				wp_enqueue_script('app', $base . 'dist/app.js', array('bootstrap'), null, true);
			} else {
				wp_register_script('bootstrap-min', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js', array('jquery'));

				// FIXME: Enqueue minified scripts in production
				wp_enqueue_script('app', $base . 'dist/app.js', array('bootstrap-min'), null, true);
			}

			wp_localize_script('app', 'WP_Theme_Settings', array(
				'imageRoot' => get_template_directory_uri() . '/dist/images/',
				'logoutURL' => wp_logout_url(home_url())
			));
			wp_localize_script('app', 'WP_API_Settings', array(
				'root' => esc_url_raw(rest_url()),
				'nonce' => wp_create_nonce('wp_rest')
			));
		}

		/**
		 * Enqueue all public app styles
		 */
		public function enqueue_styles() {
			$base = get_stylesheet_directory_uri() . '/';

			wp_enqueue_style('bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css');
			wp_enqueue_style('bootstrap-theme', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css', array('bootstrap'));
			wp_enqueue_style('app', $base . 'dist/style.css');
		}
	}
}
