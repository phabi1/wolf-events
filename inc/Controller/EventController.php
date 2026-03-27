<?php

namespace Wolf\Events\Controller;

use Wolf\Core\Mvc\Controller\EntityController;

class EventController extends EntityController
{
    protected $entityName = 'wolf-events.event';

    public function printParticipantsAction($request)
    {
        $id = $this->getIdentifierValue($request);
        return $this->get('use_case_bus')->execute('wolf-events.print_participants', ['eventId' => $id]);
    }
}