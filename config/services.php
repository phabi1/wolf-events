<?php return [
    'wolf-events.controller.checkout' => [
        'class' => \Wolf\Events\Controller\CheckoutController::class,
    ],
    'wolf-events.controller.event' => [
        'class' => \Wolf\Events\Controller\EventController::class,
        'arguments' => [
            '@wolf-events.event.entity.service'
        ]
    ],
    'wolf-events.controller.participant' => [
        'class' => \Wolf\Events\Controller\ParticipantController::class,
        'arguments' => [
            '@wolf-events.participant.entity.service'
        ]
    ],
    'wolf-events.controller.session' => [
        'class' => \Wolf\Events\Controller\SessionController::class
    ],
    'wolf-events.controller.ticket' => [
        'class' => \Wolf\Events\Controller\TicketController::class
    ],
    'wolf-events.controller.registration' => [
        'class' => \Wolf\Events\Controller\RegistrationController::class
    ],
    'wolf-events.repository.event' => [
        'class' => \Wolf\Events\Entity\Repository\EventRepository::class
    ],
    'wolf-events.repository.participant' => [
        'class' => \Wolf\Events\Entity\Repository\ParticipantRepository::class
    ],
    'wolf-events.event.entity.service' => [
        'class' => \Wolf\Events\Entity\Service\EventEntityService::class,
        'arguments' => ['@wolf.use_case_bus', '@wolf.entity.manager']
    ],
    'wolf-events.participant.entity.service' => [
        'class' => \Wolf\Events\Entity\Service\ParticipantEntityService::class,
        'arguments' => ['@wolf.use_case_bus', '@wolf.entity.manager']
    ],
    'wolf-events.token.service' => [
        'class' => \Wolf\Events\Token\TokenService::class,
    ],
    'wolf-events.use_case.get_event' => [
        'class' => \Wolf\Events\UseCase\GetEventUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.get_event']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.create_event' => [
        'class' => \Wolf\Events\UseCase\CreateEventUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.create_event']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.update_event' => [
        'class' => \Wolf\Events\UseCase\UpdateEventUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.update_event']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.create_session_for_event' => [
        'class' => \Wolf\Events\UseCase\CreateSessionForEventUseCase::class,
        'arguments' => [
            '@wolf.entity.manager'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-events.create_session_for_event'
            ]
        ]
    ],
    'wolf-events.use_case.create_ticket_for_event' => [
        'class' => \Wolf\Events\UseCase\CreateTicketForEventUseCase::class,
        'arguments' => [
            '@wolf.entity.manager'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-events.create_ticket_for_event'
            ]
        ]
    ],
    'wolf-events.use_case.register_to_event' => [
        'class' => \Wolf\Events\UseCase\RegisterToEventUseCase::class,
        'arguments' => ['@wolf.entity.manager', '@wolf.use_case_bus'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.register_to_event']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.paid_checkout' => [
        'class' => \Wolf\Events\UseCase\PaidCheckoutUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.paid_checkout']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.get_checkout_result' => [
        'class' => \Wolf\Events\UseCase\GetCheckoutResultUseCase::class,
        'arguments' => ['@wolf.entity.manager', '@wolf-events.token.service'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.get_checkout_result']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.print_participants' => [
        'class' => \Wolf\Events\UseCase\PrintParticipantsUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.print_participants']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.create_participant' => [
        'class' => \Wolf\Events\UseCase\CreateParticipantUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.create_participant']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.update_participant' => [
        'class' => \Wolf\Events\UseCase\UpdateParticipantUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.update_participant']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.delete_participant' => [
        'class' => \Wolf\Events\UseCase\DeleteParticipantUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.delete_participant']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.get_amount_for_event' => [
        'class' => \Wolf\Events\UseCase\GetAmountForEventUseCase::class,
        'arguments' => ['@wolf.entity.manager'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.get_amount_for_event']
        ],
        'shared' => false
    ]
];