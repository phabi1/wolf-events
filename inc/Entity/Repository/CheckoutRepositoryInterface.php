<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepositoryInterface;

interface CheckoutRepositoryInterface extends EntityRepositoryInterface
{
    public function getTotalAmountForEvent($eventId);
}