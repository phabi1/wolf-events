<?php

namespace Wolf\Events\Service;

class EventService
{
    private $table = 'events';

    public function getEvents()
    {
        $db = $this->getDb();
        $sql = "SELECT * FROM {$this->prefixTable($this->table)}";
        return $db->get_results($sql);
    }

    public function getEventById($id)
    {
        $db = $this->getDb();
        $sql = $db->prepare("SELECT * FROM {$this->prefixTable($this->table)} WHERE id = %d", $id);
        $entity = $db->get_row($sql);

        // Load prices
        if ($entity) {
            $price_sql = $db->prepare("SELECT * FROM {$this->prefixTable('event_prices')} WHERE event_id = %d ORDER BY weight ASC", $id);
            $entity->prices = $db->get_results($price_sql);
        }

        return $entity;
    }

    public function createEvent($data)
    {
        $db = $this->getDb();
        $db->insert($this->prefixTable($this->table), $data);
        return $db->insert_id;
    }

    public function updateEvent($id, $data)
    {
        $db = $this->getDb();
        $db->update($this->prefixTable($this->table), $data, ['id' => $id]);
    }

    public function removeEvent($id)
    {
        $db = $this->getDb();
        $db->delete($this->prefixTable($this->table), ['id' => $id]);
    }

    public function getParticipantsByEventId($eventId)
    {
        $db = $this->getDb();
        $sql = $db->prepare("SELECT * FROM {$this->prefixTable('event_participants')} WHERE event_id = %d", $eventId);
        return $db->get_results($sql);
    }

    private function getDb()
    {
        global $wpdb;
        return $wpdb;
    }

    private function prefixTable($table)
    {
        global $wpdb;
        return $wpdb->prefix . 'wolf_' . $table;
    }
}
