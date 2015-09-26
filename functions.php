<?php

namespace terraarcana {
  define('ROOT', __DIR__);

  require_once(ROOT . '/src/controllers/main.controller.php');

  if (!defined('TERRA_ARCANA')) {
    define('TERRA_ARCANA', true);
    $terraArcanaApp = MainController::instance();
  }
}
