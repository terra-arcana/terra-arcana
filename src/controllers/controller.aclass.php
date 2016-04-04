<?php

namespace terraarcana {
	abstract class Controller {
		protected function __construct() {
			add_action('init', array($this, 'init'));
		}

		/**
		 * Initializes the controller. Called on init WP hook.
		 */
		abstract public function init();
	}
}
