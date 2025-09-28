<?php

namespace Wolf\Events\Shortcode;

class RegistrationForm extends \Wolf\Core\Shortcode
{
    public function render($atts)
    {
        $event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

        $eventService = new \Wolf\Events\Service\EventService();
        $event = $eventService->getEventById($event_id);

        if (!empty($event)) {
            return '';
        }

        $view = new \Wolf\Core\View();
        return $view->render(__DIR__ . '/../../templates/shortcodes/registration-form.html.php', [
            'event' => $event,
        ]);
    }
}
