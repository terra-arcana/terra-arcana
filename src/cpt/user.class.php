<?php

namespace terraarcana {
	require_once(ROOT . '/src/cpt/cpt.aclass.php');

	class User extends CPT {

		public function __construct() {
			$this->_postTypeName = 'user';
			$this->_fields = array(
				'active_character' => array(
					'key' => 'field_5702f07fc0480'
				)
			);
		}

		/**
		 * @inheritdoc
		 */
		protected function register_post_type() {}

		/**
		 * @override
		 */
		public function get_field(array $object, $field_name, \WP_REST_Request $request, $post_type, $parent_field_name = NULL, $field_data = NULL) {
			if (function_exists('get_field')) {
				if (is_null($field_data)) {
					$field_data = $this->_fields;
				}

				if (is_null($parent_field_name)) {
					return get_field($field_data[$field_name]['key'], 'user_' . $object['id']);
				} else {
					return get_field($parent_field_name . $field_name, 'user_' . $object['id']);
				}
			}
		}

		/**
		 * @override
		 * @param WP_User $object The user being modified
		 */
		public function update_field($value, $object, $field_name) {
			if (function_exists('update_field')) {
				update_field($this->_fields[$field_name]['key'], $value, 'user_' . $object->ID);
			}
		}
	}
}
