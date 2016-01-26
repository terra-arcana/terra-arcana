<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller')) {

		/**
		 * Represents a custom post type model
		 */
		abstract class CPT extends \WP_REST_Controller {

			/**
			 * The slug used for this CPT
			 * @var string
			 */
			protected $_postTypeName = '';

			/**
			 * Custom field configuration array
			 * @var array
			 */
			protected $_fields = array();

			/**
			 * Runs on WP init hook
			 */
			public function init() {
				$this->register_post_type();

				add_action('rest_api_init', array($this, 'register_fields'));
				add_action('rest_api_init', array($this, 'register_rest_data'));
			}

			/**
			 * Register the WordPress custom post type in the database
			 */
			abstract public function register_post_type();

			/**
			 * Provide additional data to the API related to this CPT
			 */
			public function register_rest_data() {}

			/**
			 * Register all custom fields to the API
			 */
			public function register_fields() {
				foreach($this->_fields as $field_name => $field) {
					$callback = array($this, 'get_field');

					if (array_key_exists('select', $field)) {
						$callback = array($this, 'get_select_field');
					}

					if (array_key_exists('override', $field)) {
						$callback = array($this, 'get_repeater_field');
					}

					register_rest_field($this->_postTypeName, $field_name, array(
						'get_callback' => $callback
					));
				}
			}

			/**
			 * Get a custom field value. Callback from register_rest_field()
			 * @param array $object Details of current post.
			 * @param string $field_name Name of field.
			 * @param WP_REST_Request $request The current request
			 * @param string $post_type The post type
			 * @param string [$parent_field_name] The parent field name in case of a subfield. Defaults to NULL.
			 * @return string The skill type
			 */
			public function get_field(array $object, $field_name, \WP_REST_Request $request, $post_type, $parent_field_name = NULL, $field_data = NULL) {
				if (function_exists('get_field')) {
					if (is_null($field_data)) {
						$field_data = $this->_fields;
					}

					if (is_null($parent_field_name)) {
						return get_field($field_data[$field_name]['key'], $object['id']);
					} else {
						return get_field($parent_field_name . $field_name, $object['id']);
					}
				}
			}

			/**
			 * Get a custom field value from a select field, appending the rendered value
			 * as well as the literal value of the field. Callback from register_rest_field()
			 * @param array $object Details of current post.
			 * @param string $field_name Name of field.
			 * @param WP_REST_Request $request The current request
			 * @param string $post_type The post type
			 * @param string [$parent_field_name] The parent field name in case of a subfield. Defaults to NULL.
			 * @return string The skill type
			 */
			public function get_select_field(array $object, $field_name, \WP_REST_Request $request, $post_type, $parent_field_name = NULL, $field_data = NULL) {
				if (function_exists('get_field_object')) {
					if (is_null($field_data)) {
						$field_data = $this->_fields;
					}

					if (is_null($parent_field_name)) {
						$field = get_field_object($field_data[$field_name]['key'], $object['id']);
					} else {
						$field = get_field_object($parent_field_name . $field_name, $object['id']);
					}

					return array(
						'value' => $field['value'],
						'rendered' => !empty($field['value']) ? $field['choices'][$field['value']] : ''
					);
				}
			}

			/**
			 * Get a custom field value from a repeater field, overriding the automatic fetching of any 
			 * subfields specified into the `override` property of this field's entry. 
			 * Callback from register_rest_field()
			 * @param array $object Details of current post.
			 * @param string $field_name Name of field.
			 * @param WP_REST_Request $request The current request
			 * @param string $post_type The post type
			 * @param string [$parent_field_name] The parent field name in case of a subfield. Defaults to NULL.
			 * @return string The skill type
			 */
			public function get_repeater_field(array $object, $field_name, \WP_REST_Request $request, $post_type, $parent_field_name = NULL, $field_data = NULL) {
				if (function_exists('get_field')) {
					if (is_null($field_data)) {
						$field_data = $this->_fields;
					}

					if (is_null($parent_field_name)) {
						$field = get_field($field_data[$field_name]['key'], $object['id']);
					} else {
						$field = get_field($parent_field_name . $field_name, $object['id']);
					}

					$sub_field_data = $field_data[$field_name]['override'];

					foreach($sub_field_data as $sub_field_name => $override) {
						for ($i = 0; $i < count($field); $i++) {
							$field_path = sprintf('%s%s_%d_', $parent_field_name, $field_name, $i);
							
							if (array_key_exists('override', $override)) {
								$field[$i][$sub_field_name] = $this->get_repeater_field($object, $sub_field_name, $request, $post_type, $field_path, $sub_field_data);
							} else if (array_key_exists('select', $override)) {
								$field[$i][$sub_field_name] = $this->get_select_field($object, $sub_field_name, $request, $post_type, $field_path, $sub_field_data);
							} else {
								$field[$i][$sub_field_name] = $this->get_field($object, $sub_field_name, $request, $post_type, $field_path, $sub_field_data);
							}
						}
					}

					return $field;
				}
			}
		}
	}
}
