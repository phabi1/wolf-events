import { Event } from './event';

export type EventDetails = Event & {
	sessions: any[];
	tickets: any[];
};
