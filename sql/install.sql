CREATE TABLE `{prefix}wolf_events_checkout` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `checkout_id` int DEFAULT NULL,
  `amount` int NOT NULL,
  `seller_firstname` varchar(32) NOT NULL,
  `seller_lastname` varchar(32) NOT NULL,
  `seller_email` varchar(32) NOT NULL,
  `meta` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `{prefix}wolf_events_event` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_type` varchar(32) NOT NULL,
  `event_start` datetime DEFAULT NULL,
  `event_end` datetime DEFAULT NULL,
  `registration_start` datetime DEFAULT NULL,
  `registration_end` datetime DEFAULT NULL,
  `nb_participants` int NOT NULL DEFAULT '0',
  `max_participants` int DEFAULT NULL,
  `meta` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `{prefix}wolf_events_participant` (
  `id` int NOT NULL,
  `firstname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fields` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `meta` json NOT NULL,
  `event_id` int NOT NULL,
  `checkout_id` int NOT NULL,
  `ticket_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `{prefix}wolf_events_registration` (
  `id` int NOT NULL,
  `status` varchar(16) NOT NULL,
  `event_id` int NOT NULL,
  `participant_id` int NOT NULL,
  `session_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `{prefix}wolf_events_session` (
  `id` int NOT NULL,
  `session_start` datetime NOT NULL,
  `session_end` datetime NOT NULL,
  `event_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `{prefix}wolf_events_ticket` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `participant_fields` json DEFAULT NULL,
  `event_id` int NOT NULL,
  `meta` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `{prefix}wolf_events_checkout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `checkout_id` (`checkout_id`);

ALTER TABLE `{prefix}wolf_events_event`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `{prefix}wolf_events_participant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `checkout_id` (`checkout_id`),
  ADD KEY `ticket_id` (`ticket_id`);

ALTER TABLE `{prefix}wolf_events_registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `{prefix}wolf_events_registration_ibfk_1` (`event_id`),
  ADD KEY `{prefix}wolf_events_registration_ibfk_2` (`participant_id`),
  ADD KEY `session_id` (`session_id`);

ALTER TABLE `{prefix}wolf_events_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

ALTER TABLE `{prefix}wolf_events_ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

ALTER TABLE `{prefix}wolf_events_checkout`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_participant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_registration`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_session`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_ticket`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `{prefix}wolf_events_checkout`
  ADD CONSTRAINT `{prefix}wolf_events_checkout_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `{prefix}wolf_events_event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `{prefix}wolf_events_checkout_ibfk_2` FOREIGN KEY (`checkout_id`) REFERENCES `{prefix}wolf_checkout_payment` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE `{prefix}wolf_events_participant`
  ADD CONSTRAINT `{prefix}wolf_events_participant_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `{prefix}wolf_events_event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `{prefix}wolf_events_participant_ibfk_2` FOREIGN KEY (`checkout_id`) REFERENCES `{prefix}wolf_events_checkout` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `{prefix}wolf_events_participant_ibfk_3` FOREIGN KEY (`ticket_id`) REFERENCES `{prefix}wolf_events_ticket` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `{prefix}wolf_events_registration`
  ADD CONSTRAINT `{prefix}wolf_events_registration_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `{prefix}wolf_events_event` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `{prefix}wolf_events_registration_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `{prefix}wolf_events_participant` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `{prefix}wolf_events_registration_ibfk_3` FOREIGN KEY (`session_id`) REFERENCES `{prefix}wolf_events_session` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `{prefix}wolf_events_session`
  ADD CONSTRAINT `{prefix}wolf_events_session_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `{prefix}wolf_events_event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `{prefix}wolf_events_ticket`
  ADD CONSTRAINT `{prefix}wolf_events_ticket_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `{prefix}wolf_events_event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;