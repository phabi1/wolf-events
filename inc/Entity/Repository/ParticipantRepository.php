<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;
class ParticipantRepository extends EntityRepository implements ParticipantRepositoryInterface
{
    use EventRepositoryTrait;
}