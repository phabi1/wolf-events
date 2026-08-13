import PreviousIcon from '@mui/icons-material/ArrowBack';
import NextIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import CheckoutDetails from '../../components/event/CheckoutDetails';
import ParticipantFields from '../../components/event/PerticipantFields';
import checkoutService, { Checkout } from '../../services/checkouts';
import participantService, { Participant } from '../../services/participants';
import useEventDetailsStore from '../../stores/event-details';

export default function DetailsParticipantPage() {
	const params = useParams();
	const store = useEventDetailsStore();

	const [ loading, setLoading ] = useState( true );
	const [ participantDetails, setParticipantDetails ] =
		useState< Participant | null >( null );
	const [ checkout, setCheckout ] = useState< Checkout | null >( null );

	const fullName = useMemo( () => {
		if ( ! participantDetails ) return '';
		return `${ participantDetails.firstname } ${ participantDetails.lastname }`;
	}, [ participantDetails ] );

	const ticket = useMemo( () => {
		if ( ! store.event ) return '';
		if ( ! participantDetails ) return '';
		return participantDetails.ticket_id
			? store.event.tickets.find(
					( t ) => t.id === participantDetails.ticket_id
			  )?.title || ''
			: '';
	}, [ participantDetails, store.event ] );

	const navigation = useMemo( () => {
		if ( ! store.participants ) return { previous: null, next: null };
		const index = store.participants.findIndex(
			( p ) => p.id === participantDetails?.id
		);
		if ( index === -1 ) return { previous: null, next: null };
		return {
			previous: index > 0 ? store.participants[ index - 1 ] : null,
			next:
				index < store.participants.length - 1
					? store.participants[ index + 1 ]
					: null,
		};
	}, [ participantDetails, store.participants ] );

	const fields = useMemo( () => {
		if ( ! store.event ) {
			return [];
		}
		return store.event.participant_fields || [];
	}, [ store.event ] );

	useEffect( () => {
		setLoading( true );
		participantService
			.item( params.eventId!, params.participantId! )
			.then( ( details ) => {
				setParticipantDetails( details );
				if ( details.checkout_id ) {
					return checkoutService
						.item( details.checkout_id )
						.then( ( checkoutDetails ) => {
							setCheckout( checkoutDetails );
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
	}, [ params.eventId, params.participantId ] );

	return (
		<Dialog open={ true } onClose={ () => {} }>
			<DialogTitle>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Box>Participant Details</Box>
					<Box>
						<IconButton
							disabled={ ! navigation.previous }
							component={ Link }
							to={ `/${ params.eventId }/participants/${ navigation.previous?.id }` }
						>
							<PreviousIcon />
						</IconButton>
						<IconButton
							disabled={ ! navigation.next }
							component={ Link }
							to={ `/${ params.eventId }/participants/${ navigation.next?.id }` }
						>
							<NextIcon />
						</IconButton>
					</Box>
				</Stack>
			</DialogTitle>
			{ loading ? (
				<DialogContent>Loading...</DialogContent>
			) : (
				<DialogContent>
					<Box>
						<Typography variant="subtitle1">
							Basic Information
						</Typography>
						<dl>
							<dt>Full Name:</dt>
							<dd>{ fullName }</dd>
							<dt>Ticket:</dt>
							<dd>{ ticket }</dd>
						</dl>
					</Box>
					<Box>
						<Typography variant="subtitle1">
							Participant Information
						</Typography>
						<ParticipantFields
							participant={ participantDetails }
							fields={ fields }
						/>
					</Box>
					{ checkout && (
						<Box>
							<Typography variant="subtitle1">
								Checkout Information
							</Typography>
							<CheckoutDetails checkout={ checkout } />
						</Box>
					) }
					<Box sx={ { display: 'flex', gap: 2, marginTop: 2 } }>
						<Button
							variant="contained"
							color="primary"
							component={ Link }
							to={ `/${ params.eventId }/participants/${ params.participantId }/edit` }
						>
							Edit
						</Button>

						<Button
							variant="outlined"
							color="secondary"
							component={ Link }
							to={ `/${ params.eventId }/participants/${ params.participantId }/delete` }
						>
							Delete
						</Button>
					</Box>
				</DialogContent>
			) }
			<DialogActions>
				<Button
					component={ Link }
					to={ `/${ params.eventId }` }
					color="primary"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
