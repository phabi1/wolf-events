export type Participant = {
	id: string;
	firstname: string;
	lastname: string;
	ticket_id: string;
	checkout_id?: string;
};

class ParticipantService {
	async items(
		eventId: string
	): Promise< { items: Participant[]; total: number } > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants`
		);
		const data = await res.json();

		return {
			items: data.items.map( ( item: any ) => this.unserialize( item ) ),
			total: data.total,
		};
	}

	async itemsByCheckout(
		eventId: string,
		checkoutId: string
	): Promise< Participant[] > {
		const queryParams = new URLSearchParams( {
			filters: `checkout_id:eq:${ checkoutId }`,
		} );
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants?${ queryParams.toString() }`,
			{ method: 'GET' }
		);
		const data = await res.json();
		return data.map( ( item: any ) => this.unserialize( item ) );
	}

	async item(
		eventId: string,
		participantId: string
	): Promise< Participant > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants/${ participantId }`
		);
		const data = await res.json();
		return this.unserialize( data );
	}

	async create( eventId: string, data: any ): Promise< Participant > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( this.serialize( data ) ),
			}
		);
		const resData = await res.json();
		return this.unserialize( resData );
	}

	async update(
		eventId: string,
		participantId: string,
		data: any
	): Promise< Participant > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants/${ participantId }`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( this.serialize( data ) ),
			}
		);
		const resData = await res.json();
		return this.unserialize( resData );
	}

	async delete( eventId: string, participantId: string ): Promise< void > {
		await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants/${ participantId }`,
			{
				method: 'DELETE',
			}
		);
	}

	async bulkCreate(
		eventId: string,
		participants: any[]
	): Promise< Participant[] > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants/bulk`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					participants.map( ( p ) => this.serialize( p ) )
				),
			}
		);
		const resData = await res.json();
		return resData.map( ( item: any ) => this.unserialize( item ) );
	}

	private serialize( data: any ) {
		return {
			...data,
		};
	}

	private unserialize( data: any ) {
		return {
			...data,
		};
	}
}

export default new ParticipantService();
