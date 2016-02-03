<?php

namespace terraarcana {
	
	/**
	 * Handles the custom wordpress admin pages
	 */
	class AdminController {

		public function __construct() {}
		private function __clone() {}

		/**
		 * Initialize the controller
		 */
		public function init() {
			add_action('admin_menu', array($this, 'register_admin_pages'));
			add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
		}

		/**
		 * Register all custom admin pages
		 */
		public function register_admin_pages() {
			add_submenu_page('edit.php?post_type=rules', 'Éditer le Zodiaque', 'Zodiaque', 'manage_options', 'terraarcana_zodiac', array($this, 'render_zodiac_page'));
		}

		/**
		 * Register all scripts for custom admin pages
		 * @param string $slug The current page slug
		 */
		function enqueue_admin_scripts($slug) {
			$base = get_stylesheet_directory_uri() . '/';
			
			if ($slug === 'rules_page_terraarcana_zodiac') {
				wp_register_script('bootstrap-min', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js', array('jquery'));
				wp_enqueue_script('zodiac-admin', $base . 'dist/admin/zodiac/zodiac.js', array('bootstrap-min'), null, true);

				wp_localize_script(
					'zodiac-admin',
					'appLocals',
					array(
						'paths' => array(
							'js' => trailingslashit(get_template_directory_uri()) . 'app/',
							'scss' => trailingslashit(get_template_directory_uri()) . 'app/styles/'
						),
						'api' => array(
							'core' => trailingslashit(site_url()) . 'wp-json/wp/v2/',
							'terra' => trailingslashit(site_url()) . 'wp-json/terraarcana/v1/'
						)
					)
				);

				wp_enqueue_style('bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css');
				wp_enqueue_style('bootstrap-theme', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css', array('bootstrap'));
				wp_enqueue_style('zodiac-admin', $base . 'dist/admin/zodiac/style.css');
			}
		}

		/**
		 * Render the zodiac edit admin page
		 */
		public function render_zodiac_page() {
			include(ROOT . '/dist/admin/zodiac/zodiac.html');
		}
	}
}
