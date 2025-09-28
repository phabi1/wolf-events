<div class="wrap">
    <h1 class="wp-heading-inline"><?php echo $event->id ? 'Edit Event' : 'Add New Event'; ?></h1>
    <a href="?page=wolf-events" class="page-title-action">Back to Events List</a>
    <hr class="wp-header-end">
    <form method="post" action="">
        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row"><label for="title">Title</label></th>
                    <td><input name="title" type="text" id="title" value="<?php echo htmlspecialchars($data['title']); ?>" class="regular-text" required></td>
                </tr>
                <tr>
                    <th scope="row"><label for="description">Description</label></th>
                    <td><textarea name="description" id="description" class="regular-text" required><?php echo htmlspecialchars($data['description']); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="date">Date</label></th>
                    <td><input name="date" type="date" id="date" value="<?php echo htmlspecialchars($data['date']); ?>" class="regular-text" required></td>
                </tr>
                <tr>
                    <th scope="row"><label for="location">Location</label></th>
                    <td><input name="location" type="text" id="location" value="<?php echo htmlspecialchars($data['location']); ?>" class="regular-text" required></td>
                </tr>
                <tr>
                    <th scope="row"><label for="registration_start">Registration Start</label></th>
                    <td><input name="registration_start" type="date" id="registration_start" value="<?php echo htmlspecialchars($data['registration_start']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="registration_end">Registration End</label></th>
                    <td><input name="registration_end" type="date" id="registration_end" value="<?php echo htmlspecialchars($data['registration_end']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="max_participants">Max Participants</label></th>
                    <td><input name="max_participants" type="number" id="max_participants" value="<?php echo htmlspecialchars($data['max_participants']); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row">Prices</th>
                    <td>
                        <table id="prices-table" class="widefat fixed" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="width: 40%;">Label</th>
                                    <th style="width: 40%;">Amount</th>
                                    <th style="width: 20%;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($data['prices'])): ?>
                                    <?php foreach ($data['prices'] as $index => $price): ?>
                                        <tr>
                                            <td><input name="prices[<?php echo $index; ?>][title]" type="text" value="<?php echo htmlspecialchars($price->title); ?>" class="regular-text" required></td>
                                            <td><input name="prices[<?php echo $index; ?>][amount]" type="number" step="0.01" value="<?php echo htmlspecialchars($price->amount); ?>" class="regular-text" required></td>
                                            <td>
                                                <input type="hidden" name="prices[<?php echo $index; ?>][id]" value="<?php echo htmlspecialchars($price->id ?? ''); ?>">
                                                <input type="hidden" name="prices[<?php echo $index; ?>][weight]" value="<?php echo htmlspecialchars($price->weight ?? ''); ?>">
                                                <button type="button" class="button remove-price">Remove</button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                        <button type="button" id="add-price" class="button">Add Price</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <input type="hidden" name="event_id" value="<?php echo htmlspecialchars($event->id); ?>">
        <input type="hidden" name="action" value="<?php echo $event->id ? 'edit' : 'new'; ?>">
        <p class="submit">
            <input type="submit" class="button button-primary" value="<?php echo $event->id ? 'Update Event' : 'Create Event'; ?>">
        </p>
    </form>
</div>