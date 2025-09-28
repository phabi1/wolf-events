<?php

namespace Wolf\Events;

use stdClass;

class Admin
{
    public function init()
    {
        add_action('admin_menu', [$this, 'addAdminMenu']);
    }

    public function addAdminMenu()
    {
        add_menu_page(
            'Events',
            'Events',
            'manage_options',
            'wolf-events',
            [$this, 'renderEventsPage']
        );
    }

    public function renderEventsPage()
    {
        $action = $_GET['action'] ?? 'list';
        switch ($action) {
            case 'new':
                $this->renderEventsNewPage();
                break;
            case 'edit':
                $this->renderEventsEditPage();
                break;
            case 'view':
                $this->renderEventsDetailsPage();
                break;
            case 'list':
            default:
                $this->renderEventsListPage();
                break;
        }
    }

    public function renderEventsListPage()
    {
        $eventService = new Service\EventService();
        $events = $eventService->getEvents();

        $view = new \Wolf\Core\View();
        echo $view->render(__DIR__ . '/../templates/admin/events/list.html.php', ['events' => $events]);
    }

    public function renderEventsNewPage()
    {
        if (!current_user_can('manage_options')) {
            wp_die('You do not have sufficient permissions to access this page.');
        }

        $eventService = new Service\EventService();

        $form = new \Wolf\Core\Form();
        if ($form->isSubmit()) {
            $data = [
                'title' => $_POST['title'] ?? '',
                'description' => $_POST['description'] ?? '',
                'date' => $_POST['date'] ?? '',
                'location' => $_POST['location'] ?? '',
                'registration_start' => $_POST['registration_start'] ?? '',
                'registration_end' => $_POST['registration_end'] ?? '',
                'max_participants' => $_POST['max_participants'] ?? '',
                'prices' => $_POST['prices'] ?? [],
            ];
            $eventService->createEvent($data);
        } else {
            $data = [
                'title' => '',
                'description' => '',
                'date' => '',
                'location' => '',
                'registration_start' => '',
                'registration_end' => '',
                'max_participants' => '',
                'prices' => [],
            ];
        }

        $event = new stdClass();
        $event->id = null;

        $view = new \Wolf\Core\View();
        echo $view->render(__DIR__ . '/../templates/admin/events/form.html.php', ['event' => $event, 'data' => $data]);
    }

    public function renderEventsEditPage()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo 'Event ID is required for editing.';
            return;
        }

        $eventService = new Service\EventService();
        $event = $eventService->getEventById($id);

        $form = new \Wolf\Core\Form();
        if ($form->isSubmit()) {
            $data = [
                'title' => $_POST['title'] ?? '',
                'description' => $_POST['description'] ?? '',
                'date' => $_POST['date'] ?? '',
                'location' => $_POST['location'] ?? '',
                'registration_start' => $_POST['registration_start'] ?? '',
                'registration_end' => $_POST['registration_end'] ?? '',
                'max_participants' => $_POST['max_participants'] ?? '',
                'prices' => $_POST['prices'] ?? [],
            ];
            $eventService->updateEvent($id, $data);
        } else {
            $data = [
                'title' => $event->title ?? '',
                'description' => $event->description ?? '',
                'date' => $event->date ?? '',
                'location' => $event->location ?? '',
                'registration_start' => $event->registration_start ?? '',
                'registration_end' => $event->registration_end ?? '',
                'max_participants' => $event->max_participants ?? '',
                'prices' => $event->prices ?? [],
            ];
        }

        $view = new \Wolf\Core\View();
        echo $view->render(__DIR__ . '/../templates/admin/events/form.html.php', ['event' => $event, 'data' => $data]);
    }

    public function renderEventsDetailsPage()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo 'Event ID is required to view details.';
            return;
        }

        $eventService = new Service\EventService();
        $event = $eventService->getEventById($id);

        if (!$event) {
            echo 'Event not found.';
            return;
        }

        $participants = $eventService->getParticipantsByEventId($id);

        $view = new \Wolf\Core\View();
        echo $view->render(__DIR__ . '/../templates/admin/events/details.html.php', ['event' => $event, 'participants' => $participants]);
    }
}
