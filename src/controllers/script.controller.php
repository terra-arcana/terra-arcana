<?php

namespace terraarcana {
	require_once(ROOT . '/src/controllers/controller.aclass.php');

	/**
	 * Handles the queuing of public scripts
	 */
	class ScriptController extends Controller {

		/**
		 * Google Maps API key
		 * @var string
		 */
		private $google_maps_api_key = 'AIzaSyAPVHFI_O9iN7bKW_oz3kw_NTOup1qi4zQ';

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
			add_filter('acf/settings/google_api_key', array($this, 'register_gmaps_api'));
		}

		/**
		 * Enqueue all public app scripts
		 */
		public function enqueue_scripts() {
			$base = get_stylesheet_directory_uri() . '/';

			if (isset($_GET['debug'])) {
				wp_register_script('bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.js', array('jquery'));

				wp_enqueue_script('app', $base . 'dist/app.js', array('bootstrap'), null, true);
			} else {
				wp_register_script('bootstrap-min', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js', array('jquery'));

				// FIXME: Enqueue minified scripts in production
				wp_enqueue_script('app', $base . 'dist/app.js', array('bootstrap-min'), null, true);
			}

			wp_localize_script('app', 'WP_Theme_Settings', array(
				'imageRoot' => get_template_directory_uri() . '/dist/images/',
				'logoutURL' => wp_logout_url(home_url()),
				'googleMapsAPIKey' => $this->google_maps_api_key
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

			wp_enqueue_style('gfonts', 'https://fonts.googleapis.com/css?family=Cinzel+Decorative:400,700|PT+Serif:400,700,700italic,400italic|PT+Serif+Caption');
			wp_enqueue_style('bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css');
			wp_enqueue_style('bootstrap-theme', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css', array('bootstrap'));
			wp_enqueue_style('terra-arcana', $base . 'dist/terra-arcana.css');
		}

		/**
		 * Register the API key for ACF Google Maps fields
		 * @see https://developers.google.com/maps/documentation/javascript/get-api-key
		 */
		public function register_gmaps_api($api) {
			return $this->google_maps_api_key;
		}
	}
}
