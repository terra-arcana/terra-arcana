<?php

namespace terraarcana {
	define('API_PREFIX', 'terraarcana');

	require_once(ROOT . '/src/cpt/codex.class.php');

	/**
	 * @name DataManager
	 * @desc Handles the creation and maintenance of the data layer
	 */
	class DataManager {

		private $_cpts = array();

		public function __construct() {
			if (class_exists('WP_REST_Controller')) {
				$this->_cpts = array(
					'codex' 	=> new Codex()
				);
			}
		}

		private function __clone() {}

		/**
		 * @name init
		 * @desc Run on WP init hook
		 */
		public function init() {
			// Run init() on all CPTs
			foreach($this->_cpts as $name => $cpt) {
				$cpt->init();
			}
		}
	}
}
