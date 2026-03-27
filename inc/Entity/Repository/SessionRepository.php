<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;

class SessionRepository extends EntityRepository implements EventAwareInterface
{
    use EventRepositoryTrait;
}