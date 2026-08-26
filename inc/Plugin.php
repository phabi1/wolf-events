<?php

namespace Wolf\Events;

use Wolf\Core\Migration\Migrator;

class Plugin
{
    public function run()
    {

        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('plugins_loaded', [$this, 'setup']);
        add_action('init', [$this, 'init']);
    }

    public function setup()
    {
        Migrator::upgrade('wolf-events', WOLF_EVENTS_PLUGIN_DIR, __NAMESPACE__, WOLF_EVENTS_PLUGIN_VERSION);
    }

    public function init()
    {
        $admin = new Admin();
        $admin->setup();

        $api = new Api();
        $api->setup();

        $this->registerBlocks();

    }

    public function registerBlocks()
    {
        wp_register_block_types_from_metadata_collection(WOLF_EVENTS_PLUGIN_DIR . 'build', WOLF_EVENTS_PLUGIN_DIR . 'build/blocks-manifest.php');
    }

    public function activate()
    {
        $installer = new Installer();
        $installer->run();
    }

    public function deactivate()
    {
        $uninstaller = new Uninstaller();
        $uninstaller->run();
    }
}