<?php

namespace Wolf\Events;

class Shortcodes
{
    private $shortcodes = [];
    private $namespace = 'wolf_events_';

    public function __construct($shortcodes = [], $namespace)
    {
        $this->namespace = $namespace;
        foreach ($shortcodes as $name => $class) {
            $this->add($name, $class);
        }
    }

    public function add($name, $class)
    {
        $this->shortcodes[$name] = $class;
    }

    public function remove($name)
    {
        if (isset($this->shortcodes[$name])) {
            unset($this->shortcodes[$name]);
        }
    }

    public function init()
    {
        foreach ($this->shortcodes as $name => $class) {
            $shortcode = new ('Wolf\Events\Shortcode\\' . $class)($name, $this->namespace);
            $shortcode->init();
        }
    }
}
