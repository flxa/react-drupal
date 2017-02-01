<?php

use Drupal\Core\Config\BootstrapConfigStorageFactory;
use Drupal\Core\Database\Database;

require_once __DIR__ . '/settings.skpr.php';

$settings['container_yamls'][] = __DIR__ . '/services.yml';

$databases['default']['default'] = array(
  'driver' => 'mysql',
  'database' => skpr_config('db.name') ?: 'local',
  'username' => skpr_config('db.username') ?: 'drupal',
  'password' => skpr_config('db.password') ?: 'drupal',
  'host' => skpr_config('db.host') ?: 'localhost',
);
$config['cron_safe_threshold'] = '0';
$settings['file_public_path'] = skpr_config('file.public') ?: 'sites/default/files';
$config['system.file.path.temporary'] = skpr_config('file.tmp') ?: '/tmp';
$settings['file_private_path'] = skpr_config('file.private') ?: '/private';

$settings['install_profile'] = 'APP_NAME_profile';

if (skpr_config('smtp.username') && skpr_config('smtp.password')) {
  $config['swiftmailer.transport']['smtp_host'] = skpr_config('smtp.host') ?: 'email-smtp.us-east-1.amazonaws.com';
  $config['swiftmailer.transport']['smtp_username'] = skpr_config('smtp.username') ?: '';
  $config['swiftmailer.transport']['smtp_password'] = skpr_config('smtp.password') ?: '';
  $config['swiftmailer.transport']['smtp_port'] = skpr_config('smtp.port') ?: '25';
  $config['swiftmailer.transport']['smtp_encryption'] = skpr_config('smtp.encryption') ?: 'tls';
  $config['swiftmailer.transport']['transport'] = skpr_config('smtp.transport') ?: 'smtp';
}

$config_directories['sync'] = __DIR__ . '/../../../config-export';

// * Stops twig cache from being built on shared file storage.
// * In the project root to avoid collisions and for security.
$settings['php_storage']['twig'] = array(
  'directory' => DRUPAL_ROOT . '/../.php',
);

$settings['hash_salt'] = !empty($settings['hash_salt']) ? $settings['hash_salt'] : '2MRTupNXITYmtP7eRB58';

// PreviousNext domains (local / dev)
$settings['trusted_host_patterns'][] = '^127\.0\.0\.1$';
$settings['trusted_host_patterns'][] = '^previousnext\-pr[0-9]+\.APP_NAME\.ci\.pnx\.com\.au$';
$settings['trusted_host_patterns'][] = '^APP_NAME\-\w+\.cd\.pnx\.com\.au$';
$settings['trusted_host_patterns'][] = '^' . preg_quote('APP_NAME.dev') . '$';
$settings['trusted_host_patterns'][] = '^' . preg_quote('APP_NAME.qa.previousnext.com.au') . '$';
$settings['trusted_host_patterns'][] = '^' . preg_quote('APP_NAME.staging.previousnext.com.au') . '$';


// Reverse proxy address range on dev05.
$settings['reverse_proxy_addresses'][] = '172.17.42.0/24';

if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
  $settings['reverse_proxy'] = TRUE;
  $settings['reverse_proxy_proto_header'] = 'HTTP_CLOUDFRONT_FORWARDED_PROTO';
  $settings['reverse_proxy_port_header'] = 'SERVER_PORT';

  // We take all the headers which are provided to us from upstream.
  // This looks like: 0.0.0.0, 1.1.1.1, 2.2.2.2
  $proxies = explode(", ", $_SERVER['HTTP_X_FORWARDED_FOR']);

  // 0.0.0.0 is the users IP address, so we remove it from the list
  // of reverse proxies.
  array_shift($proxies);

  // The X-Forwarded-For header might not cover the last reverse proxy
  // so we ensure that is on the list as well.
  $proxies[] = $_SERVER['REMOTE_ADDR'];

  $settings['reverse_proxy_addresses'] = array_unique(array_merge($settings['reverse_proxy_addresses'], $proxies));
}

$settings['slushi_cache_melt_time'] = 86400;

// Check if module is enabled.
Database::setMultipleConnectionInfo($databases);
$bootstrap_config = BootstrapConfigStorageFactory::get($class_loader);
$modules = $bootstrap_config->read('core.extension');
if ($modules && isset($modules['module']['slushi_cache'])) {
  // If the module is not yet enabled, you cannot refer to its services, but
  // you cannot check if the module is enabled this early. We can however rely
  // on the autoloader.
  $settings['cache']['bins']['render'] = 'cache.backend.slushi';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.slushi';
}

// Allow local settings overrides.
foreach (glob(__DIR__ . '/settings.*.php') as $filename) {
  include_once $filename;
}
