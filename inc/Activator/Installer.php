<?php

namespace Wolf\Events\Activator;

class Installer
{
    public function run()
    {
        $this->createTables();
    }

    private function createTables()
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $sqls = file_get_contents(__DIR__ . '/../sql/install.sql');

        $sqls = str_replace('{prefix}', $wpdb->prefix, $sqls);

        dbDelta($sqls);
    }
}