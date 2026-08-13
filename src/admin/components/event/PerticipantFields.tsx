import { useMemo } from 'react';

export type ParticipantFieldsProps = {
	participant: any;
	fields: any[];
};

export default function ParticipantFields( {
	participant,
	fields,
}: ParticipantFieldsProps ) {
	const values = useMemo( () => {
		if ( ! participant || ! fields ) return [];
		return fields.map( ( field ) => {
			return {
				label: field.label,
				value: participant.fields[ field.name ] || '-',
			};
		} );
	}, [ participant, fields ] );

	return (
		<dl>
			{ values.map( ( field, index ) => (
				<div key={ index }>
					<dt>{ field.label }</dt>
					<dd>{ field.value }</dd>
				</div>
			) ) }
		</dl>
	);
}
