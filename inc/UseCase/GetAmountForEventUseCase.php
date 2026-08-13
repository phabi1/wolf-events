<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\Entity\EntityManager;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Events\Entity\Repository\CheckoutRepositoryInterface;

class GetAmountForEventUseCase implements UseCaseInterface
{

    private CheckoutRepositoryInterface $checkoutRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->checkoutRepository = $entityManager->getRepository('wolf-events.checkout');
    }

    function execute(array $data = [])
    {
        $eventId = $data['event_id'];
        return $this->checkoutRepository->getTotalAmountForEvent($eventId);
    }
}