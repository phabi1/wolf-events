<?php

namespace Wolf\Events;

class Setup
{
    public function activate()
    {
        $this->createTables();
    }

    public function deactivate()
    {
        $this->removeTables();
    }

    private function createTables()
    {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Create necessary database tables
        global $wpdb;
        $event_table = $wpdb->prefix . 'wolf_events';
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $event_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            title tinytext NOT NULL,
            date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            location tinytext NOT NULL,
            description text NOT NULL,
            registration_start datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            registration_end datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            max_participants mediumint(9) DEFAULT '0' NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        dbDelta($sql);

        $price_table = $wpdb->prefix . 'wolf_event_prices';
        $sql_price = "CREATE TABLE $price_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            event_id mediumint(9) NOT NULL,
            title varchar(100) NOT NULL,
            amount decimal(10,2) NOT NULL,
            currency varchar(10) NOT NULL,
            PRIMARY KEY  (id),
            FOREIGN KEY (event_id) REFERENCES $table_name(id) ON DELETE CASCADE
        ) $charset_collate;";

        dbDelta($sql_price);

        // You can add more tables if needed
        $participants_table = $wpdb->prefix . 'wolf_event_participants';
        $sql_participants = "CREATE TABLE $participants_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            event_id mediumint(9) NOT NULL,
            checkout_id mediumint(9) NOT NULL,
            firstname varchar(100) NOT NULL,
            lastname varchar(100) NOT NULL,
            PRIMARY KEY  (id),
            FOREIGN KEY (event_id) REFERENCES $event_table(id) ON DELETE CASCADE,
            FOREIGN KEY (checkout_id) REFERENCES {$this->prefixTable('checkout_orders')}(id) ON DELETE CASCADE
        ) $charset_collate;";
        dbDelta($sql_participants);
    }

    private function removeTables()
    {
        global $wpdb;

        $tables = ['wolf_events', 'wolf_event_prices', 'wolf_event_participants'];

        foreach ($tables as $table) {
            $table_name = $wpdb->prefix . $table;
            $sql = "DROP TABLE IF EXISTS $table_name;";
            $wpdb->query($sql);
        }
    }

    private function prefixTable($table)
    {
        global $wpdb;
        return $wpdb->prefix . 'wolf_' . $table;
    }
}
