<?php

// HTTP Auth.
$cli = php_sapi_name() === 'cli';
$http_auth_user = skpr_config('auth.user') ?: '';
$http_auth_pass = skpr_config('auth.pass') ?: '';
if (!$cli && !empty($http_auth_user) && !empty($http_auth_pass)) {
  if (!(isset($_SERVER['PHP_AUTH_USER']) && ($_SERVER['PHP_AUTH_USER'] === $http_auth_user && $_SERVER['PHP_AUTH_PW'] === $http_auth_pass))) {
    header('WWW-Authenticate: Basic realm="This site is protected"');
    header('HTTP/1.0 401 Unauthorized');
    // Fallback message when the user presses cancel / escape.
    echo 'Access denied';
    exit;
  }
}
