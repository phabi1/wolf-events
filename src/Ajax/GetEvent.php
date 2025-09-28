<?php

namespace Wolf\Events\Ajax;

class GetEvent
{
    public function handle()
    {
        wp_send_json_success(['message' => 'Event data retrieved successfully']);
    }
}
