import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import ParticipantForm from '../../components/participant/ParticipantForm';
import ParticipantService from '../../services/participants';
import useEventDetailsStore from '../../stores/event-details';

type FormProps = {
	firstname: string;
	lastname: string;
	ticket_id: string;
	fields: Record< string, any >;
};

export default function NewParticipantPage() {
	const initialData: FormProps = {
		firstname: '',
		lastname: '',
		ticket_id: '',
		fields: {},
	};

	const params = useParams();
	const eventId = params.eventId!;
	const form = useForm< FormProps >( {
		defaultValues: initialData,
	} );
	const [ showSnackbar, setShowSnackbar ] = useState( false );
	const [ snackbarMessage, setSnackbarMessage ] = useState( '' );
	const refreshParticipants = useEventDetailsStore(
		( state ) => state.refreshParticipants
	);

	const navigate = useNavigate();

	const handleClose = () => {
		navigate( -1 ); // Go back to the previous page
	};

	const handleCreate = async ( data: FormProps ) => {
		console.log( 'Creating participant with data:', data );
		try {
			await ParticipantService.create( eventId, {
				...data,
			} );

			// Handle success, e.g., show a success message or redirect
			setSnackbarMessage( 'Participant created successfully!' );
			setShowSnackbar( true );
		} catch ( err ) {
			console.error( 'Error creating participant:', err );
			setSnackbarMessage( 'Error creating participant.' );
			setShowSnackbar( true );
		} finally {
			navigate( -1 ); // Go back to the previous page
			refreshParticipants( eventId );
		}
	};

	return (
		<>
			<Dialog open={ true } onClose={ handleClose }>
				<DialogTitle>New Participant</DialogTitle>
				<DialogContent>
					<form onSubmit={ form.handleSubmit( handleCreate ) }>
						<ParticipantForm eventId={ eventId } form={ form } />
					</form>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={ handleClose }
						color="primary"
						disabled={ form.formState.isSubmitting }
					>
						Close
					</Button>
					<Button
						onClick={ form.handleSubmit( handleCreate ) }
						color="primary"
						disabled={ form.formState.isSubmitting }
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={ showSnackbar }
				autoHideDuration={ 6000 }
				onClose={ () => setShowSnackbar( false ) }
				message={ snackbarMessage }
			/>
		</>
	);
}
