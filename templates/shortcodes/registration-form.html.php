     <div id="app"></div>
     <?php
        $info = include_once ABSPATH . 'wp-content/plugins/wolf-events/dist/event-registration-form.asset.php';
        wp_enqueue_script('event-registration-form', plugins_url('../../dist/event-registration-form.js', __FILE__), array_merge(['wp-element', 'jquery'], $info['dependencies']), $info['version'], true);
        ?>