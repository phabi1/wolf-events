import { create } from 'zustand';
import { EventDetails } from '../models/event-details';
import ParticipantService, { Participant } from '../services/participants';
import EventService from '../services/events';

const useEventDetailsStore = create< {
	loading: boolean;
	event: EventDetails | null;
	participants: Participant[];
	amount: number;
	refreshParticipants: ( eventId: string ) => Promise< void >;
	loadEvent: ( eventId: string ) => Promise< void >;
} >( ( set ) => ( {
	loading: true,
	event: null,
	amount: 0,
	participants: [],
	loadEvent: async ( eventId: string ) => {
		set( { loading: true } );
		const event = await EventService.item( eventId );
		const amount = await EventService.amount( eventId );
		set( { event, amount, loading: false } );
	},
	refreshParticipants: async ( eventId: string ) => {
		const data = await ParticipantService.items( eventId );
		set( ( state ) => ( {
			participants: data.items.map( ( item: any ) => ( {
				...item,
				ticket:
					state.event?.tickets.find(
						( t ) => t.id === item.ticket_id
					) || null,
			} ) ),
		} ) );
	},
} ) );

export default useEventDetailsStore;
