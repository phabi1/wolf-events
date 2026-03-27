<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\Entity\EntityRepository;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Events\Entity\Repository\ParticipantRepositoryInterface;
use Wolf\Events\Print\ParticipantList;
use Wolf\Events\Entity\Repository\ParticipantRespository;
use Wolf\Events\Entity\Repository\SessionRepository;

class PrintParticipantsUseCase implements UseCaseInterface
{
    private EntityRepository $eventRepository;

    /**
     * Summary of SessionRepository
     * @var SessionRepository
     */
    private SessionRepository $sessionRepository;

    /**
     * Summary of participantRepository
     * @var ParticipantRepositoryInterface
     */
    private ParticipantRepositoryInterface $participantRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->eventRepository = $entityManager->getRepository('wolf-events.event');
        $this->participantRepository = $entityManager->getRepository('wolf-events.participant');
        $this->sessionRepository = $entityManager->getRepository('wolf-events.session');
    }

    public function execute(array $params = [])
    {
        $eventId = $params['eventId'];

        $event = $this->eventRepository->findById($eventId);
        $sessions = $this->sessionRepository->findByEventId($eventId);

        $days = count($sessions) ?? 1;

        $participants = $this->participantRepository->findByEventId($eventId);

        usort($participants, function ($a, $b) {
            return strcmp($a->firstname . ' ' . $a->lastname, $b->firstname . ' ' . $b->lastname);
        });

        $pdf = new ParticipantList();
        $pdf->setParticipants($participants);
        $pdf->setDays($days);
        $pdf->setTitle($event->title);
        
        $pdfContent = $pdf->render();
        return [
            'pdf' => base64_encode($pdfContent),
            'filename' => $this->generateFilename($event)
        ];
    }

    protected function generateFilename($event)
    {
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $event->title);
        return $filename . '.pdf';
    }
}