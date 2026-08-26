import { useFormContext } from 'react-hook-form';
import useModal from '../../../hooks/use-modal';
import { useMemo, useState } from 'react';
import UiCollection from '../../ui/Collection';
import ParticipantFieldDialog from './participants/ParticipantFieldDialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FieldIcon from './participants/FieldIcon';

export function ParticipantFieldItem( { item }: { item: any } ) {
	const { watch } = useFormContext();
	const tickets = watch( 'tickets' ) || [];

	const ticketLabels = useMemo( () => {
		return item.tickets.map( ( ticketIndex: number ) => {
			const ticket = tickets[ ticketIndex ];
			return ticket
				? ticket.title || `Ticket ${ ticketIndex + 1 }`
				: `Ticket ${ ticketIndex + 1 }`;
		} );
	}, [ item, tickets ] );

	return (
		<Box display="flex" alignItems="center" gap={ 2 } padding={ 2 }>
			<div>
				<FieldIcon type={ item.type } />
			</div>
			<div>
				<div>{ item.label }</div>
				{ item.required && (
					<Typography variant="caption">Required</Typography>
				) }
				<div>
					{ ticketLabels.length > 0 ? (
						<Typography variant="caption">
							Apply to tickets: { ticketLabels.join( ', ' ) }
						</Typography>
					) : (
						<Typography variant="caption">
							Apply to all tickets
						</Typography>
					) }
				</div>
			</div>
		</Box>
	);
}

export default function EventParticipantsForm() {
	const { watch, setValue } = useFormContext();
	const items = watch( 'participant_fields' ) as any[];

	const { isOpen, openModal, closeModal } = useModal();
	const [ selectedItemIndex, setSelectedItemIndex ] = useState<
		number | null
	>( null );

	const selectedItem = useMemo( () => {
		if ( selectedItemIndex !== null && items ) {
			return items[ selectedItemIndex ];
		}
		return null;
	}, [ selectedItemIndex, items ] );

	const handleAddItem = () => {
		const newItem = {
			label: '',
			type: 'text',
			required: false,
			tickets: [],
		};
		setValue( 'tickets', [ ...( items || [] ), newItem ] );
		setSelectedItemIndex( items ? items.length : 0 );
		openModal();
	};

	const handleRemoveItem = ( index: number ) => {
		const updatedItems = [ ...( items || [] ) ];
		updatedItems.splice( index, 1 );
		setValue( 'participant_fields', updatedItems );
	};

	const handleItemDialogClose = ( data: any | null ) => {
		if ( data !== null && selectedItemIndex !== null ) {
			const updatedItems = [ ...( items || [] ) ];
			updatedItems[ selectedItemIndex ] = data;
			setValue( 'participant_fields', updatedItems );
		}
		closeModal();
	};

	return (
		<div>
			<UiCollection
				items={ items }
				renderItem={ ( item: any, index: number ) => (
					<ParticipantFieldItem item={ item } />
				) }
				onAddItem={ handleAddItem }
				onRemoveItem={ handleRemoveItem }
				onItemClicked={ ( index ) => {
					setSelectedItemIndex( index );
					openModal();
				} }
				onMoveItems={ ( items ) => {
					setValue( 'participant_fields', items );
				} }
			/>
			<ParticipantFieldDialog
				isOpen={ isOpen }
				selectedField={ selectedItem }
				onClose={ handleItemDialogClose }
			/>
		</div>
	);
}
