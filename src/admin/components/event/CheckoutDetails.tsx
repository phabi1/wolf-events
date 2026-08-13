import { useMemo } from 'react';
import { Checkout } from '../../services/checkouts';
import MailTo from '../ui/MailTo';

export default function CheckoutDetails( {
	checkout,
}: {
	checkout: Checkout;
} ) {
	const fullName = useMemo( () => {
		return checkout.seller_firstname + ' ' + checkout.seller_lastname;
	}, [ checkout ] );

	return (
		<dl>
			<dt>Name</dt>
			<dd>{ fullName }</dd>
			<dt>Email</dt>
			<dd>
				<MailTo email={ checkout.seller_email } />
			</dd>
			<dt>Amount</dt>
			<dd>{ checkout.amount }</dd>
			<dt>Date</dt>
			<dd>{ checkout.date.toLocaleString() }</dd>
		</dl>
	);
}
