<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;

class CreateTicketForEventUseCase implements UseCaseInterface
{
    private $ticketRepository;

    public function __construct(
        EntityManager $entityManager
    ) {
        $this->ticketRepository = $entityManager->getRepository('wolf-events.ticket');
    }

    public function execute(array $params = [])
    {
        $event_id = $params['event_id'];
        $data = $params['data'];

        $ticketData = $data;
        $ticketData['event_id'] = $event_id;
        return $this->ticketRepository->insert($ticketData);
    }
}