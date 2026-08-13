import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useModal from '../../../hooks/use-modal';
import UiCollection from '../../ui/Collection';
import TicketDialog from './tickets/TicketDialog';

export function TicketItem( {
	item,
	index,
	control,
}: {
	item: any;
	index: number;
	control: any;
} ) {
	return (
		<div>
			{ item.title } - ${ item.amount } - Participant Max:{ ' ' }
			{ item.participant_max }
		</div>
	);
}

export default function EventTicketsForm() {
	const { control, watch, setValue } = useFormContext();
	const items = watch( 'tickets' );

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
			title: '',
			amount: 0,
			participant_max: 0,
		};
		setValue( 'tickets', [ ...( items || [] ), newItem ] );
		setSelectedItemIndex( items ? items.length : 0 );
		openModal();
	};

	const handleRemoveItem = ( index: number ) => {
		const updatedItems = [ ...( items || [] ) ];
		updatedItems.splice( index, 1 );
		setValue( 'tickets', updatedItems );
	};

	const handleItemDialogClose = ( data: any | null ) => {
		if ( data !== null && selectedItemIndex !== null ) {
			const updatedItems = [ ...( items || [] ) ];
			updatedItems[ selectedItemIndex ] = data;
			setValue( 'tickets', updatedItems );
		}
		closeModal();
	};

	return (
		<div>
			<UiCollection
				items={ items }
				renderItem={ ( item: any, index: number ) => (
					<TicketItem
						item={ item }
						index={ index }
						control={ control }
					/>
				) }
				onAddItem={ handleAddItem }
				onRemoveItem={ handleRemoveItem }
				onItemClicked={ ( index ) => {
					setSelectedItemIndex( index );
					openModal();
				} }
				onMoveItems={ ( items ) => {
					setValue( 'tickets', items );
				} }
			/>
			<TicketDialog
				isOpen={ isOpen }
				selectedTicket={ selectedItem }
				onClose={ handleItemDialogClose }
			/>
		</div>
	);
}
