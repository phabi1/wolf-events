<?php

namespace Wolf\Events;

use Wolf\Core\Di\ContainerAwareInterface;
use Wolf\Core\Di\ContainerAwareTrait;
use Wolf\Core\Plugin;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;
    /**
     * Summary of routesHelper
     * @var Wolf\Core\Rest\Routes
     */
    private $restRoutesHelper;

    public function setup()
    {
        add_action('rest_api_init', function () {
            $this->restRoutesHelper = Plugin::getContainer()->get('wolf.rest.routes');
            $this->registerEventRoutes();
            $this->registerSessionRoutes();
            $this->registerTicketRoutes();
            $this->registerParticipantRoutes();
        });
    }

    protected function getContainer()
    {
        if ($this->container === null) {
            $this->setContainer(Plugin::getContainer());
        }
        return $this->container;
    }

    public function getController($controllerName)
    {
        return $this->getContainer()->get($controllerName);
    }

    protected function registerEventRoutes()
    {
        $controller = $this->getController('wolf-events.controller.event');
        $this->restRoutesHelper->createRoutes('wolf-events/v1', 'events', $controller);
    }

    protected function registerSessionRoutes()
    {
        $controller = $this->getController('wolf-events.controller.session');
        $this->restRoutesHelper->createRoutes('wolf-events/v1', 'events/(?P<event_id>\d+)/sessions', $controller);
    }

    protected function registerTicketRoutes()
    {
        $controller = $this->getController('wolf-events.controller.ticket');
        $this->restRoutesHelper->createRoutes('wolf-events/v1', 'events/(?P<event_id>\d+)/tickets', $controller);
    }

    protected function registerParticipantRoutes()
    {
        $controller = $this->getController('wolf-events.controller.participant');
        $this->restRoutesHelper->createRoutes('wolf-events/v1', 'events/(?P<event_id>\d+)/participants', $controller);
        register_rest_route('wolf-events/v1', '/events/(?P<event_id>\d+)/participants/print', [
            'methods' => 'POST',
            'callback' => [$controller, 'print'],
            'permission_callback' => '__return_true',
        ]);
    }
}