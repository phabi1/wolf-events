<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Events\Entity\Repository\EventRepositoryInterface;
use Wolf\Events\Entity\Repository\ParticipantRepositoryInterface;
use Wolf\Events\Entity\Repository\TicketRepositoryInterface;

class CreateParticipantUseCase implements UseCaseInterface
{
    private EventRepositoryInterface $eventRepository;
    private TicketRepositoryInterface $ticketRepository;
    private ParticipantRepositoryInterface $participantRepository;

    public function __construct(
        EntityManager $entityManager
    ) {
        $eventRepository = $entityManager->getRepository('wolf-events.event');
        $this->eventRepository = $eventRepository;

        $ticketRepository = $entityManager->getRepository('wolf-events.ticket');
        $this->ticketRepository = $ticketRepository;

        $participantRespository = $entityManager->getRepository('wolf-events.participant');
        $this->participantRepository = $participantRespository;
    }

    public function execute(array $params = [])
    {        $event = $this->eventRepository->find($params['event_id']);
        if (!$event) {
            throw new \Exception("Event not found");
        }

        $ticket = $this->ticketRepository->find($params['ticket_id']);
        if (!$ticket) {
            throw new \Exception("Ticket not found");
        }

        $participantData = [
            'event_id' => $params['event_id'],
            'ticket_id' => $params['ticket_id'],
            'checkout_id' => $params['checkout_id'],
            'firstname' => $params['firstname'],
            'lastname' => $params['lastname'],
            'fields' => $params['fields'] ?? []
        ];

        $participant = $this->participantRepository->insert($participantData);
        $this->eventRepository->updateParticipantCount($params['event_id']);
        $this->ticketRepository->updateParticipantCount($params['ticket_id']);

        return $participant;
    }
}