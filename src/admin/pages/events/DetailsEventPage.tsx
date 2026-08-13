import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router';
import EventParticipantList from '../../components/event/ParticipantList';
import EventSessionSummary from '../../components/event/SessionSummary';
import EventTicketSummary from '../../components/event/TicketSummary';
import UiPage from '../../components/ui/Page';
import PrintService from '../../services/print';
import useEventDetailsStore from '../../stores/event-details';

export default function DetailsEventPage() {
	const { eventId } = useParams();
	const navigate = useNavigate();

	const loading = useEventDetailsStore((state) => state.loading);
	const item = useEventDetailsStore((state) => state.event);
	const amount = useEventDetailsStore((state) => state.amount);
	const loadEvent = useEventDetailsStore((state) => state.loadEvent);
	const participants = useEventDetailsStore(
		(state) => state.participants
	);
	const refreshParticipants = useEventDetailsStore(
		(state) => state.refreshParticipants
	);

	useEffect(() => {
		if (eventId) {
			loadEvent(eventId).then(() => {
				refreshParticipants(eventId);
			});
		} else {
			navigate('/');
		}
	}, [eventId, navigate]);

	const handleParticipantEdit = useCallback(
		(participantId: string) => {
			navigate(`/${eventId}/participants/${participantId}/edit`);
		},
		[eventId, navigate]
	);

	const handleParticipantDelete = useCallback(
		(participantId: string) => {
			navigate(`/${eventId}/participants/${participantId}/delete`);
		},
		[eventId, navigate]
	);

	const handleParticipantClick = useCallback(
		(participantId: string) => {
			navigate(`/${eventId}/participants/${participantId}`);
		},
		[eventId, navigate]
	);

	const handlePrintParticipants = useCallback(() => {
		PrintService.printPdf(eventId!).catch((err) => {
			console.error('Error printing participants:', err);
		});
	}, [eventId]);

	return (
		<>
			<div className="wrap">
				<Link to="/">Back to list</Link>
				{loading ? (
					<p>Loading...</p>
				) : (
					item && (
						<UiPage title={item.title} subtitle="Event Details" actions={[
							{ label: 'Edit', to: `/${eventId}/edit`, primary: true },
							{ label: 'View event', handle: () => window.location.href = `/events/${eventId}`, primary: true },
							{ label: 'Duplicate', to: `/${eventId}/duplicate` },
							{ label: 'Delete', to: `/${eventId}/delete` }
						]}>
							<h2>Default information</h2>
							<Paper sx={{ padding: 2, marginBottom: 2 }}>
								<p>Type: {item.event_type}</p>
								<p>
									Start:{' '}
									{item.event_start
										? item.event_start.toISOString()
										: null}
								</p>
								<p>
									End:{' '}
									{item.event_end
										? item.event_end.toISOString()
										: null}
								</p>
							</Paper>
							<Box
								sx={{
									display: 'flex',
									gap: 2,
									marginBottom: 2,
								}}
							>
								<Paper sx={{ flex: 1, padding: 2 }}>
									<h3>Sessions</h3>
									<EventSessionSummary
										sessions={item.sessions}
									/>
								</Paper>
								<Paper sx={{ flex: 1, padding: 2 }}>
									<h3>Tickets</h3>
									<EventTicketSummary
										tickets={item.tickets}
										maxParticipants={item.participant_max}
									/>
								</Paper>
								<Paper sx={{ flex: 1, padding: 2 }}>
									<h3>Amount</h3>
									<Typography>{amount}</Typography>
								</Paper>
							</Box>
							<h2>Participants</h2>
							<div>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: 2,
									}}
								>
									<div>
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/${eventId}/participants/new`}
										>
											Add participant
										</Button>
										<Button
											variant="outlined"
											color="primary"
											component={Link}
											to={`/${eventId}/participants/import`}
											sx={{ marginLeft: 2 }}
										>
											Import participants
										</Button>
									</div>
									<div>
										<Button
											variant="contained"
											onClick={handlePrintParticipants}
										>
											Print
										</Button>
									</div>
								</Box>
								<EventParticipantList
									participants={participants}
									fields={item.participant_fields}
									onParticipantClick={
										handleParticipantClick
									}
									onParticipantEdit={handleParticipantEdit}
									onParticipantDelete={
										handleParticipantDelete
									}
								/>
							</div>
						</UiPage>
					)
				)}
			</div>
			<Outlet />
		</>
	);
}
