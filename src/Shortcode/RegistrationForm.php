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

        $info = include_once ABSPATH . 'wp-content/plugins/wolf-events/dist/event-registration-form/main.asset.php';
        wp_enqueue_script('event-registration-form', plugins_url('../../dist/event-registration-form/main.js', __FILE__), array_merge(['wp-element', 'jquery'], $info['dependencies']), $info['version'], true);

        $view = new \Wolf\Core\View();
        return $view->render(__DIR__ . '/../../templates/shortcodes/registration-form.html.php', [
            'event' => $event,
        ]);
    }
}
