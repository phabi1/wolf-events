<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface EventRepositoryInterface extends EntityRepositoryInterface
{
    public function updateParticipantCount($eventId);
}