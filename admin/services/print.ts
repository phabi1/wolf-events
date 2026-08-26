class PrintService {
	async printPdf( eventId: string ) {
		const res = await fetch(
			`/wp-json/wolf-events/v1/events/${ eventId }/participants/print`,
			{
				method: 'POST',
			}
		);

		const blob = await res.blob();

		window.open( URL.createObjectURL( blob ), '_blank' );
	}
}

export default new PrintService();
