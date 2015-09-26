<?php

namespace terraarcana {
    /**
    * @name ScriptManager
    * @desc Handles the queuing of public scripts
    */
    class ScriptManager {

        public function __construct() {}
        private function __clone() {}

        /**
        * @name init
        * @desc Run on WP init hook
        */
        public function init() {
            add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts') );
            add_action( 'wp_enqueue_scripts', array($this, 'enqueue_styles') );
        }

        /**
        * @name enqueue_scripts
        * @desc Enqueue all public app scripts
        */
        public function enqueue_scripts() {
            $base = get_stylesheet_directory_uri() . '/';

            wp_register_script( 'bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js', array('jquery') );

            wp_enqueue_script( 'app', $base . 'dist/app.js', array( 'bootstrap' ), null, true );

            $this->localize_scripts();
        }

        public function enqueue_styles() {
            wp_enqueue_style( 'bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.min.css' );
        }

        /**
        * @name localize_scripts
        * @desc Serve localization data and generic useful data to public app
        */
        private function localize_scripts() {
        	wp_localize_script(
        		'app',
        		'applocals',
        		array(
        			'templates' => trailingslashit( get_template_directory_uri() ) . 'app/templates/'
        		)
        	);
        }
    }
}
