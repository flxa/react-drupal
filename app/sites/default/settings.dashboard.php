<?php

$config['dashboard_connector.settings']['enabled'] = skpr_config('dashboard.enabled') ?: TRUE;
$config['dashboard_connector.settings']['base_uri'] = 'https://status.previousnext.com.au';
$config['dashboard_connector.settings']['client_id'] = '{{ app_name }}';
$config['dashboard_connector.settings']['site_id'] = '{{ app_name }}' . (getenv('SKIPPER_ENV') ?: 'local');
$config['dashboard_connector.settings']['env'] = getenv('SKIPPER_ENV') ?: 'local';
$config['dashboard_connector.settings']['username'] = skpr_config('dashboard.username') ?: 'connector';
$config['dashboard_connector.settings']['password'] = skpr_config('dashboard.password') ?: 'TGyUryDscYDhsVcc7NRp6EXK';
