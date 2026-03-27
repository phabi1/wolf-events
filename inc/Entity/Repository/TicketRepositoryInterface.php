<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface TicketRepositoryInterface extends EntityRepositoryInterface, EventAwareInterface
{
    public function updateParticipantCount($ticketId);
}