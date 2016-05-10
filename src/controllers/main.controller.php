<?php

namespace terraarcana {
	require_once(ROOT . '/src/controllers/controller.aclass.php');

	require_once(ROOT . '/src/controllers/data.controller.php');
	require_once(ROOT . '/src/controllers/script.controller.php');
	require_once(ROOT . '/src/controllers/admin.controller.php');
	require_once(ROOT . '/src/controllers/login.controller.php');

	require_once(ROOT . '/vendor/tgmpa/tgm-plugin-activation/class-tgm-plugin-activation.php');

	/**
	 * Main app controller
	 */
	class MainController extends Controller {

		/**
		 * Singleton instance reference
		 * @var MainController
		 * @static
		 */
		private static $_instance;

		/**
		 * Data controller reference
		 * @var DataController
		 */
		private $_dataController;

		/**
		 * Script controller reference
		 * @var ScriptController
		 */
		private $_scriptController;

		/**
		 * Admin controller reference
		 * @var AdminController
		 */
		private $_adminController;

		/**
		 * Login controller reference
		 * @var LoginController
		 */
		private $_loginController;

		public function __construct() {
			parent::__construct();

			$this->_dataController = DataController::getInstance();
			$this->_scriptController = new ScriptController();
			$this->_adminController = new AdminController();
			$this->_loginController = new LoginController();

			add_action('after_switch_theme', array($this, 'activate_theme'));
			add_action('switch_theme', array($this, 'deactivate_theme'));
			add_action('tgmpa_register', array($this, 'register_plugin_dependencies'));
		}

		private function __clone() {}

		/**
		 * Used for singleton purposes
		 */
		public static function instance() {
			if (!(self::$_instance instanceof self)) {
				self::$_instance = new self();
			}
			return self::$_instance;
		}

		/**
		 * @override
		 */
		public function init() {}

		/**
		 * Adds all required custom capabilities to roles.
		 * Runs on theme activation.
		 */
		public function activate_theme() {
			$admin = get_role('administrator');
			$admin->add_cap('publish_characters');
			$admin->add_cap('edit_character');

			$contributor = get_role('contributor');
			$contributor->add_cap('publish_characters');
			$contributor->add_cap('edit_character');
		}

		/**
		 * Removes all custom capabilities to roles.
		 * Runs on theme deactivation.
		 */
		public function deactivate_theme() {
			$admin = get_role('administrator');
			$admin->remove_cap('publish_characters');
			$admin->remove_cap('edit_character');

			$contributor = get_role('contributor');
			$contributor->remove_cap('publish_characters');
			$contributor->remove_cap('edit_character');
		}

		/**
		 * Registers all dependent plugins for proper theme functionality
		 */
		public function register_plugin_dependencies() {
			$plugins = array(
				array(
					'name' 			=> 'WP REST API',
					'slug' 			=> 'rest-api',
					'required' 		=> true,
				),
				array(
					'name' 			=> 'Advanced Custom Fields Pro',
					'slug' 			=> 'advanced-custom-fields-pro',
					'source' 		=> 'http://connect.advancedcustomfields.com/index.php?p=pro&a=download',
					'required' 		=> true,
					'external_url' 	=> 'http://www.advancedcustomfields.com'
				)
			);

			$config = array(
				'default_path'  => '',
				'menu'          => 'tgmpa-install-plugins',
				'has_notices'   => true,
				'dismissable'   => true,
				'dismiss_msg'   => '',
				'is_automatic'  => false,
				'message'       => '',
				'strings'       => array(
					'page_title'                      => __('Install Required Plugins', 'tgmpa'),
					'menu_title'                      => __('Install Plugins', 'tgmpa'),
					'installing'                      => __('Installing Plugin: %s', 'tgmpa'), // %s = plugin name.
					'oops'                            => __('Something went wrong with the plugin API.', 'tgmpa'),
					'notice_can_install_required'     => _n_noop('This theme requires the following plugin: %1$s.', 'This theme requires the following plugins: %1$s.'), // %1$s = plugin name(s).
					'notice_can_install_recommended'  => _n_noop('This theme recommends the following plugin: %1$s.', 'This theme recommends the following plugins: %1$s.'), // %1$s = plugin name(s).
					'notice_cannot_install'           => _n_noop('Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.'), // %1$s = plugin name(s).
					'notice_can_activate_required'    => _n_noop('The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.'), // %1$s = plugin name(s).
					'notice_can_activate_recommended' => _n_noop('The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.'), // %1$s = plugin name(s).
					'notice_cannot_activate'          => _n_noop('Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.'), // %1$s = plugin name(s).
					'notice_ask_to_update'            => _n_noop('The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.', 'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.'), // %1$s = plugin name(s).
					'notice_cannot_update'            => _n_noop('Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.'), // %1$s = plugin name(s).
					'install_link'                    => _n_noop('Begin installing plugin', 'Begin installing plugins'),
					'activate_link'                   => _n_noop('Begin activating plugin', 'Begin activating plugins'),
					'return'                          => __('Return to Required Plugins Installer', 'tgmpa'),
					'plugin_activated'                => __('Plugin activated successfully.', 'tgmpa'),
					'complete'                        => __('All plugins installed and activated successfully. %s', 'tgmpa'), // %s = dashboard link.
					'nag_type'                        => 'updated' // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
				)
			);

			tgmpa($plugins, $config);
		}
	}
}
