<?php

namespace Wolf\Events\Entity\Repository;

use Wolf\Core\Entity\EntityRepository;

class CheckoutRepository extends EntityRepository
{
    use EventRepositoryTrait;

    public function findByMeta($metaKey, $metaValue)
    {
        $where = 'json_extract(meta, \'$.' . $metaKey . '\') = \'' . $metaValue . '\'';

        $sql = $this->db->createQuery();
        $sql->from($this->definition['table'])
            ->where($where);
        return $this->db->row($sql);
    }
}