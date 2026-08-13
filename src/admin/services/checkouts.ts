export type Checkout = {
	id: string;
	seller_firstname: string;
	seller_lastname: string;
	seller_email: string;
	amount: number;
	date: Date;
};

class CheckoutService {
	async item( checkoutId: string ): Promise< Checkout > {
		const res = await fetch(
			`/wp-json/wolf-events/v1/checkouts/${ checkoutId }`
		);
		const data = await res.json();
		return this.unserialize( data );
	}

	private unserialize( data: any ): Checkout {
		return {
			...data,
			date: new Date( data.date * 1000 ),
		};
	}
}

export default new CheckoutService();
