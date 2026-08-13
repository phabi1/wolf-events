<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;
class ParticipantRepository extends EntityRepository implements ParticipantRepositoryInterface
{
    use EventRepositoryTrait;

    public function deleteByCheckoutId($checkoutId)
    {
        $this->db->delete($this->definition['table'], ['checkout_id' => $checkoutId]);
    }
}