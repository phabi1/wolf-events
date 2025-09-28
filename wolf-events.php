<?php

/*
Plugin Name: Wolf Events
Description: A plugin to manage and display events in WordPress.
Version: 1.0.0
Author: phabi1
Requires Plugins: wolf-core, wolf-checkout
*/

if (! function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

require_once 'vendor/autoload.php';
function wolf_events_plugin()
{
    $plugin = new \Wolf\Events\Plugin();
    $plugin->init();
}
wolf_events_plugin();

function wolf_events_activate()
{
    $plugin = new \Wolf\Events\Setup();
    $plugin->activate();
}

function wolf_events_deactivate()
{
    $plugin = new \Wolf\Events\Setup();
    $plugin->deactivate();
}

register_activation_hook(__FILE__, 'wolf_events_activate');
register_deactivation_hook(__FILE__, 'wolf_events_deactivate');
