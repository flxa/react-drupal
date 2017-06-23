<?php
/**
 * @file
 * Provides configuration for Memcache connectivity..
 *
 * Requires "memcache_storage" module.
 */

require_once __DIR__ . '/settings.skpr.php';

$endpoint = skpr_config('memcache.endpoint', '');
$port = skpr_config('memcache.port', '');

if (!empty($endpoint) && !empty($port)) {
  $conf['memcache_options'] = array(
    Memcached::OPT_DISTRIBUTION => Memcached::DISTRIBUTION_CONSISTENT,
    // This is for Elasticache.
    Memcached::OPT_CLIENT_MODE  => Memcached::DYNAMIC_CLIENT_MODE,
  );

  $conf['memcache_stampede_protection'] = TRUE;

  $settings['memcache_storage']['memcached_servers'] = [
    "$endpoint:$port" => 'default',
  ];

  // Why not assign to "$settings['cache']['default']"?
  //   * This has caused Drush to segfault (mainly the "discovery" bin)
  //   * We want to target the bins that we know provide the most value, and keep
  //     bins that are thoroughly tested as their defaults.
  $settings['cache']['bins']['entity'] = 'cache.backend.memcache_storage';
  $settings['cache']['bins']['config'] = 'cache.backend.memcache_storage';
  $settings['cache']['bins']['menu'] = 'cache.backend.memcache_storage';
  $settings['cache']['bins']['toolbar'] = 'cache.backend.memcache_storage';
  $settings['cache']['bins']['render'] = 'cache.backend.memcache_storage';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.memcache_storage';
}
