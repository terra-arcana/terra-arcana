<?php

namespace terraarcana {
	define('API_PREFIX', 'terraarcana');

	require_once(ROOT . '/src/controllers/controller.aclass.php');

	require_once(ROOT . '/src/cpt/character.class.php');
	require_once(ROOT . '/src/cpt/character-class.class.php');
	require_once(ROOT . '/src/cpt/codex.class.php');
	require_once(ROOT . '/src/cpt/point-node.class.php');
	require_once(ROOT . '/src/cpt/rules.class.php');
	require_once(ROOT . '/src/cpt/skill.class.php');
	require_once(ROOT . '/src/cpt/user.class.php');

	require_once(ROOT . '/src/routes/graph-data.route.php');
	require_once(ROOT . '/src/routes/user-characters.route.php');

	/**
	 * Handles the creation and maintenance of the data layer
	 */
	class DataController extends Controller {

		private static $_instance;

		private $_cpts = array();
		private $_routes = array();

		protected function __construct() {
			parent::__construct();

			if (class_exists('WP_REST_Controller')) {
				$this->_cpts = array(
					'character' => new Character(),
					'character-class' => new CharacterClass(),
					'codex' => new Codex(),
					'point-node' => new PointNode(),
					'rules' => new Rules(),
					'skill' => new Skill(),
					'user' => new User()
				);

				$this->_routes = array(
					'graph-data' => new GraphDataRoute(),
					'user-characters' => new UserCharactersRoute()
				);

				foreach ($this->_routes as $route) {
					add_action('rest_api_init', array($route, 'register_routes'));
				}
			}
		}

		private function __clone() {}

		/**
		 * Returns the singleton instance of this class
		 * @return DataController
		 */
		public static function getInstance() {
			if (self::$_instance === null) {
				self::$_instance = new self();
			}

			return self::$_instance;
		}

		/**
		 * @override
		 */
		public function init() {
			// Run init() on all CPTs
			foreach($this->_cpts as $name => $cpt) {
				$cpt->init();
			}
		}

		/**
		 * Return the CPT entity of a certain slug
		 * @param $slug The CPT slug
		 * @return CPT
		 */
		public function getCPT($slug) {
			return $this->_cpts[$slug];
		}
	}
}
