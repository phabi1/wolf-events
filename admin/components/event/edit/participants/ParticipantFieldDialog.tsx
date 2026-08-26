import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import InputField from '../../../forms/fields/InputField';
import SelectField from '../../../forms/fields/SelectField';
import SwitchField from '../../../forms/fields/SwitchField';
import SwitchPanelField from '../../../forms/fields/SwitchPanelField';
import Form from '../../../forms/Form';
import CheckboxesField from '../../../forms/fields/CheckboxesField';

export default function ParticipantFieldDialog( {
	isOpen,
	onClose,
	selectedField,
}: any ) {
	const types = [
		{ label: 'Text', value: 'text' },
		{ label: 'Number', value: 'number' },
		{ label: 'Email', value: 'email' },
		{ label: 'Date', value: 'date' },
		{ label: 'Select', value: 'select' },
		{ label: 'Checkbox', value: 'checkbox' },
		{ label: 'File Upload', value: 'file' },
	];

	const { watch } = useFormContext();

	const tickets = watch( 'tickets' ) || [];

	const ticketOptions = useMemo( () => {
		return tickets.map( ( ticket: any, index: number ) => ( {
			label: ticket.title || `Ticket ${ index + 1 }`,
			value: index,
		} ) );
	}, [ tickets ] );

	const form = useForm( {
		defaultValues: {
			label: '',
			type: '',
			required: false,
			options: false,
			tickets: [],
		},
	} );

	useEffect( () => {
		if ( selectedField ) {
			form.reset( {
				label: selectedField.label,
				type: selectedField.type,
				required: selectedField.required,
				options: selectedField.options,
				tickets: selectedField.tickets,
			} );
		} else {
			form.reset( {
				label: '',
				type: '',
				required: false,
				options: false,
				tickets: [],
			} );
		}
	}, [ selectedField, form ] );

	const handleTicketsClose = () => {
		form.setValue( 'tickets', [] );
	};

	const handleDialogClose = ( shouldSave: boolean, data?: any ) => {
		if ( shouldSave ) {
			onClose( data );
		} else {
			onClose( null );
		}
		form.reset();
	};
	return (
		<Form
			form={ form }
			onSubmit={ form.handleSubmit( ( data ) =>
				handleDialogClose( true, data )
			) }
		>
			<Dialog
				open={ isOpen }
				onClose={ () => handleDialogClose( false ) }
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Edit Participant Field</DialogTitle>
				<DialogContent>
					<InputField name={ `label` } label="Label" />
					<SelectField
						name={ `type` }
						label="Type"
						options={ types }
					/>
					<SwitchField name={ `required` } label="Required" />
					<SwitchPanelField
						name={ `options` }
						label="Apply to tickets"
						onClose={ handleTicketsClose }
					>
						<CheckboxesField
							name={ `tickets` }
							label="Tickets"
							options={ ticketOptions }
						/>
					</SwitchPanelField>
				</DialogContent>
				<DialogActions>
					<Button onClick={ () => handleDialogClose( false ) }>
						Close
					</Button>
					<Button
						type="button"
						variant="contained"
						onClick={ form.handleSubmit( ( data ) =>
							handleDialogClose( true, data )
						) }
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Form>
	);
}
