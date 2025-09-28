<div class="wrap">
    <h1 class="wp-heading-inline">Events List</h1>
    <a href="?page=wolf-events&action=new" class="page-title-action">Add New Event</a>
    <hr class="wp-header-end">
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($events as $event): ?>
                <tr>
                    <td><?php echo htmlspecialchars($event->id); ?></td>
                    <td><a href="?page=wolf-events&action=view&id=<?php echo htmlspecialchars($event->id); ?>"><?php echo htmlspecialchars($event->title); ?></a></td>
                    <td><?php echo htmlspecialchars($event->date); ?></td>
                    <td><?php echo htmlspecialchars($event->location); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>