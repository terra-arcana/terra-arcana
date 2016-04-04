<?php

namespace terraarcana {

	class LoginController {
		public function init() {
			add_action('login_enqueue_scripts', array($this, 'login_enqueue_scripts'));
		}

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
