<?php

namespace Wolf\Events\Entity\Repository;

interface EventAwareInterface
{
    public function findByEventId(int $eventId);
}