export interface Event {
	id: string;
	title: string;
	slug: string;
	event_type: string;
	event_start: Date | null;
	event_end: Date | null;
	registration_start: Date | null;
	registration_end: Date | null;
	participant_nb: number;
	participant_max: number | null;
	participant_fields: any[];
}
