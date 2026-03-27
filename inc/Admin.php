<?php

namespace Wolf\Events;

class Admin
{
    public function setup()
    {
        add_action('wolf_admin_menu', [$this, 'addAdminMenu']);
    }

    public function addAdminMenu()
    {
        add_submenu_page(
            'wolf',
            __('Events', 'wolf-events'),
            __('Events', 'wolf-events'),
            'manage_options',
            'wolf-events',
            [$this, 'renderPage'],
            70
        );
    }

    public function renderPage()
    {
        //include the index.assest.php file for taking the dependencies and               version
        $mfile = include(plugin_dir_path(__FILE__) . '../build/admin/index.asset.php');

        //enqueue the react built script
        wp_enqueue_script('wolf-events-admin-js', plugin_dir_url(__DIR__) . '/build/admin/index.js', $mfile['dependencies'], $mfile['version'], true);
        wp_enqueue_style('wolf-events-admin-css', plugin_dir_url(__DIR__) . '/build/admin/index.css', [], $mfile['version']);
        echo '<div id="app"></div>';
    }
}