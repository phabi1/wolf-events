import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ParticipantService, { Participant } from '../../services/participants';
import CheckoutService, { Checkout } from '../../services/checkouts';
import Snackbar from '@mui/material/Snackbar';
import useEventDetailsStore from '../../stores/event-details';

export default function DeleteParticipantPage() {
	const params = useParams();
	const eventId = params.eventId!;
	const participantId = params.participantId!;

	const [ open, setOpen ] = useState( true );
	const [ loading, setLoading ] = useState( true );
	const [ busy, setBusy ] = useState( false );
	const [ participantDetails, setParticipantDetails ] =
		useState< Participant | null >( null );
	const [ checkout, setCheckout ] = useState< Checkout | null >( null );
	const [ checkoutItems, setCheckoutItems ] = useState< any[] >( [] );

	const [ showSnackbar, setShowSnackbar ] = useState( false );
	const [ snackbarMessage, setSnackbarMessage ] = useState( '' );
	const refreshParticipants = useEventDetailsStore(
		( state ) => state.refreshParticipants
	);

	const navigate = useNavigate();

	const handleClose = () => {
		setOpen( false );
	};

	const handleDelete = async () => {
		setBusy( true );
		// Placeholder for delete participant logic

		try {
			await ParticipantService.delete( eventId, participantId );

			// Handle success, e.g., show a success message or redirect
			setSnackbarMessage( 'Participant deleted successfully!' );
			setShowSnackbar( true );
		} catch ( err ) {
			console.error( 'Error deleting participant:', err );
			setSnackbarMessage( 'Error deleting participant.' );
			setShowSnackbar( true );
		} finally {
			setBusy( false );
			setOpen( false );
			refreshParticipants( eventId );
		}
	};

	useEffect( () => {
		if ( ! eventId || ! participantId ) {
			setLoading( false );
			setParticipantDetails( null );
		} else {
			setLoading( true );
			ParticipantService.item( eventId, participantId )
				.then( ( details ) => {
					setParticipantDetails( details );
					if ( details.checkout_id ) {
						return Promise.all( [
							CheckoutService.item( details.checkout_id ),
							ParticipantService.itemsByCheckout(
								eventId,
								details.checkout_id
							),
						] )
							.then( ( [ checkoutDetails, checkoutItems ] ) => {
								setCheckout( checkoutDetails );
								setCheckoutItems( checkoutItems );
							} )
							.catch( ( err ) => {
								console.error(
									'Error fetching checkout details:',
									err
								);
							} );
					} else {
						return null;
					}
				} )
				.catch( ( err ) => {
					console.error( 'Error fetching participant details:', err );
				} )
				.finally( () => {
					setLoading( false );
				} );
		}
	}, [ eventId, participantId ] );

	useEffect( () => {
		if ( ! open ) {
			navigate( -1 ); // Go back to the previous page
		}
	}, [ open, navigate ] );

	return (
		<>
			<Dialog open={ open } onClose={ handleClose }>
				<DialogTitle>Delete Participant</DialogTitle>
				<DialogContent>
					{ loading ? (
						<div>Loading...</div>
					) : (
						<>
							{ checkout && (
								<DialogContentText>
									Participant{ ' ' }
									{ participantDetails?.firstname }{ ' ' }
									{ participantDetails?.lastname } has a
									checkout with amount { checkout.amount }.
								</DialogContentText>
							) }
							{ checkoutItems.length > 0 && (
								<div>
									<div>
										This checkout includes{ ' ' }
										{ checkoutItems.length } item(s).
									</div>
									<ul>
										{ checkoutItems.map( ( item ) => (
											<li key={ item.id }>
												Participant: { item.firstname }{ ' ' }
												{ item.lastname }
											</li>
										) ) }
									</ul>
								</div>
							) }
							<DialogContentText>
								Are you sure you want to delete this
								participant? This action cannot be undone.
							</DialogContentText>
						</>
					) }
				</DialogContent>
				<DialogActions>
					<Button
						onClick={ handleClose }
						color="primary"
						disabled={ busy }
					>
						Close
					</Button>
					<Button
						onClick={ handleDelete }
						color="primary"
						disabled={ busy }
					>
						Delete
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
