<?php

namespace Wolf\Events\Controller;

use Wolf\Core\Mvc\Controller\EntityController;
use Wolf\Events\Entity\Service\ParticipantEntityService;

class ParticipantController extends EntityController
{
    public function __construct(
        ParticipantEntityService $entityService
    ) {
        $this->entityService = $entityService;
    }

    protected function buildFilters($request)
    {
        $filters = parent::buildFilters($request);
        if ($request->get_param('event_id')) {
            $filters['event_id'] = ['eq' => (int) $request->get_param('event_id')];
        }
        return $filters;
    }

    protected function prepareDataFromRequest(array $data, \WP_REST_Request $request)
    {
        $prepared = parent::prepareDataFromRequest($data, $request);
        $prepared['event_id'] = (int) $request->get_param('event_id');
        return $prepared;
    }

    public function printAction(\WP_REST_Request $request)
    {
        $eventId = (int) $request->get_param('event_id');
        $res = $this->getService('wolf.use_case_bus')->execute('wolf-events.print_participants', ['eventId' => $eventId, 'days' => 5]);
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment;filename="' . $res['filename'] . '"');

        echo base64_decode($res['pdf']);
        exit;
    }
}