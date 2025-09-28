<?php

namespace Wolf\Events\Shortcode;

class RegistrationButton extends \Wolf\Core\Shortcode
{
    public function render($atts)
    {

        if (empty($atts['event_id'])) {
            return '';
        }

        $view = new \Wolf\Core\View();
        return $view->render(__DIR__ . '/../../templates/shortcodes/registration-button.html.php', [
            'event_id' => $atts['event_id'],
            'text'     => $atts['text'],
            'class'    => $atts['class'],
            'link'     => '/event-registration?event_id=' . $atts['event_id'],
        ]);
    }
}
