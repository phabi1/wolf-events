<?php

namespace Wolf\Events;

class Ajax
{
    public function init($routes = [])
    {
        $this->registerRoutes($routes);
    }

    private function registerRoutes($routes)
    {
        foreach ($routes as $info) {
            $route = $info['route'];
            $callback = $info['callback'];
            $auth = $info['auth'] ?? 'both';

            $className = 'Wolf\Events\Ajax\\' . $callback;
            if (!class_exists($className)) {
                continue; // Skip if the class does not exist
            }
            $callback = new $className();

            if ($auth === 'both' || $auth === 'public') {
                // Register public route
                add_action("wp_ajax_nopriv_{$route}", [$callback, 'handle']);
            }
            if ($auth === 'both' || $auth === 'private') {
                // Register private route
                add_action("wp_ajax_{$route}", [$callback, 'handle']);
            }
        }
    }
    
}
