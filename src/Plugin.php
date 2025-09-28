<?php

namespace Wolf\Events;

class Plugin
{
    private $namespace = 'wolf-events';

    public function init()
    {
        $admin = new Admin();
        $admin->init();

        $this->setupShortcodes();

        $ajax = new Ajax();
        $ajax->init([
            [
                'route' => 'get_event',
                'callback' => 'GetEvent',
                'auth' => 'both', // Options: 'public', 'private', 'both'
            ],
        ]);
    }

    private function setupShortcodes()
    {
        $shortcodes = new Shortcodes(
            [
                'event-registration-button' => 'RegistrationButton',
                'event-registration-form'   => 'RegistrationForm',
            ],
            $this->namespace
        );
        $shortcodes->init();
    }
}
