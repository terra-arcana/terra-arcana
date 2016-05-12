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

			add_action('register_form', array($this, 'render_register_fields'));
			add_action('user_register', array($this, 'user_register_password'), 100);
			add_filter('registration_errors', array($this, 'register_validate'), 10, 1);
			add_filter('registration_redirect', array($this, 'login_redirect'));
		}

		/**
		 * Enqueues custom styles and scripts on the default WordPress login page
		 */
		public function login_enqueue_scripts() {
			wp_enqueue_style('ta-login', get_stylesheet_directory_uri() . '/dist/login.css');
		}

		/**
		 * Redirects the user to the homepage after login/register
		 * @return {string} The URL to redirect to
		 */
		public function login_redirect() {
			return home_url();
		}

		/**
		 * Render custom fields in register form, such as password and anti-robot question
		 */
		public function render_register_fields() {
			include(ROOT . '/src/views/login/register-form.php');
		}

		/**
		 * Custom registration form validation
		 * @param {WP_Error} $errors Existing errors
		 * @return {WP_Error} Final errors
		 */
		public function register_validate($errors) {
			// Validate password
			if (
				empty($_POST['password']) ||
				empty($_POST['password_confirm']) ||
				$_POST['password'] != $_POST['password_confirm']
			) {
				$errors->add('password_error', '<strong>ERREUR</strong> : Le mot de passe est invalide');
			}

			// Validate anti-robot mechanism
			if ($_POST['human'] != 'Terra Arcana') {
				$errors->add('human_error', '<strong>BEEP BOOP!</strong> On dirait que vous êtes un robot!');
			}

			return $errors;
		}

		/**
		 * Store password in database upon user registration
		 * @param {Number} $user_id The newly created user ID
		 */
		public function user_register_password($user_id) {
			wp_update_user(array(
				'ID' => $user_id,
				'user_pass' => $_POST['password']
			));
		}
	}
}
