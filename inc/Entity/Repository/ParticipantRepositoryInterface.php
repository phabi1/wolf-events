<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface ParticipantRepositoryInterface extends EntityRepositoryInterface, EventAwareInterface
{
    public function deleteByCheckoutId($checkoutId);
}