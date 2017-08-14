<?php

/**
 * @file
 * Drush configuration settings for the project.
 */

/**
 * List of skip tables.
 *
 * List of tables whose *data* is skipped by the 'sql-dump' and 'sql-sync'
 * commands when the "--structure-tables-key=common" option is provided.
 * You may add specific tables to the existing array or add a new element.
 */
$options['structure-tables']['common'] = [
  'cache',
  'cache_*',
  'history',
  'search_*',
  'sessions',
  'watchdog',
];

require_once __DIR__ . '/../app/sites/default/settings.skpr.php';
if ($uri = skpr_config('drush.uri')) {
  $options['uri'] = $uri;
}
