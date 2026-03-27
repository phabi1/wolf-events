<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Events\Entity\Repository\EventRepository;
use Wolf\Events\Entity\Repository\TicketRepository;

class RegisterToEventUseCase implements UseCaseInterface
{
    private $useCaseBus;
    private $participantRepository;

    private $checkoutRepository;


    private EventRepository $eventRepository;

    private TicketRepository $ticketRepository;

    public function __construct(EntityManager $entityManager)
    {

        $this->participantRepository = $entityManager->getRepository('wolf-events.participant');
        $this->checkoutRepository = $entityManager->getRepository('wolf-events.checkout');
        $eventRepository = $entityManager->getRepository('wolf-events.event');
        if (!($eventRepository instanceof EventRepository)) {
            throw new \Exception("Event repository must be instance of EventRepository");
        }
        $this->eventRepository = $eventRepository;
        $ticketRepository = $entityManager->getRepository('wolf-events.ticket');
        if (!($ticketRepository instanceof TicketRepository)) {
            throw new \Exception("Ticket repository must be instance of TicketRepository");
        }
        $this->ticketRepository = $ticketRepository;
    }

    public function execute(array $params = [])
    {
        $checkoutData = [
            'event_id' => $params['event_id'],
            'seller_firstname' => $params['registration']['firstname'],
            'seller_lastname' => $params['registration']['lastname'],
            'seller_email' => $params['registration']['email'],
            'amount' => $params['registration']['amount'] ?? 0,
            'meta' => $params['registration']['meta'] ?? []
        ];

        $checkout = $this->checkoutRepository->insert($checkoutData);

        $ticketUpdates = [];

        foreach ($params['participants'] as $participant) {
            $data = [
                'firstname' => $participant['firstname'],
                'lastname' => $participant['lastname'],
                'fields' => $participant['fields'] ?? [],
                'event_id' => $params['event_id'],
                'ticket_id' => $participant['ticket_id'] ?? null,
                'checkout_id' => $checkout->id
            ];

            $this->participantRepository->insert($data);
            if (isset($data['ticket_id'])) {
                if (!in_array($data['ticket_id'], $ticketUpdates)) {
                    $ticketUpdates[] = $data['ticket_id'];
                }
            }
        }

        $this->eventRepository->updateParticipantCount($params['event_id']);

        foreach ($ticketUpdates as $ticketId) {
            $this->ticketRepository->updateParticipantCount($ticketId);
        }
    }
}