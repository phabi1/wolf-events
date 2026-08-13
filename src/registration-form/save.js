import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eventId } = attributes;

	return (
		<div
			{ ...useBlockProps.save() }
			data-event-id={ eventId }
		/>
	);
}
