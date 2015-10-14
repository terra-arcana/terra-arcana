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
        * @desc Runs on WP init hook
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

            if (isset($_GET['debug'])) {
                wp_register_script( 'bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.js', array('jquery') );

                wp_enqueue_script( 'app', $base . 'dist/app.js', array( 'bootstrap' ), null, true );
            } else {
                wp_register_script( 'bootstrap-min', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js', array('jquery') );

                // FIXME: Enqueue minified scripts in production
                wp_enqueue_script( 'app', $base . 'dist/app.js', array( 'bootstrap-min' ), null, true );
            }

            $this->localize_scripts();
        }

        public function enqueue_styles() {
            $base = get_stylesheet_directory_uri() . '/';

            wp_enqueue_style( 'bootstrap', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css' );
            wp_enqueue_style( 'bootstrap-theme', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css', array( 'bootstrap' ) );
            wp_enqueue_style( 'app', $base . 'dist/style.css' );
        }

        /**
        * @name localize_scripts
        * @desc Serve localization data and generic useful data to public app
        */
        private function localize_scripts() {
            wp_localize_script(
                'app',
                'appLocals',
                array(
                    'jsPath' => trailingslashit( get_template_directory_uri() ) . 'app/',
                    'scssPath' => trailingslashit( get_template_directory_uri() ) . 'app/styles/',
                    'apiCorePath' => trailingslashit( site_url() ) . '/wp-json/wp/v2/',
                    'apiTerraPath' => trailingslashit( site_url() ) . '/wp-json/terraarcana/v1/'
                )
            );
        }
    }
}
