<div class="wrap">
    <h1 class="wp-heading-inline"><?php echo $event->title; ?></h1>
    <a href="?page=wolf-events" class="page-title-action">Back to Events List</a>
    <a href="?page=wolf-events&action=edit&id=<?php echo htmlspecialchars($event->id); ?>" class="page-title-action">Edit Event</a>
    <hr class="wp-header-end">
    <div>
        <h2>Informations</h2>
        <div><strong>Date:</strong> <?php echo htmlspecialchars($event->date); ?></div>
        <div><strong>Location:</strong> <?php echo htmlspecialchars($event->location); ?></div>
        <div><strong>Description:</strong> <?php echo nl2br(htmlspecialchars($event->description)); ?></div>
    </div>
    <div>
        <h2>Participants</h2>
        <?php if (!empty($participants)): ?>
            <form>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($participants as $participant): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($participant->id); ?></td>
                                <td><?php echo htmlspecialchars($participant->firstname); ?></td>
                                <td><?php echo htmlspecialchars($participant->lastname); ?></td>
                                <td>
                                    <a href="?page=wolf-events&action=remove_participant&participant_id=<?php echo htmlspecialchars($participant->id); ?>&event_id=<?php echo htmlspecialchars($event->id); ?>" class="button button-danger" onclick="return confirm('Are you sure you want to remove this participant?');">Remove</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </form>
        <?php else: ?>
            <div>No participants yet.</div>
        <?php endif; ?>
    </div>
</div>