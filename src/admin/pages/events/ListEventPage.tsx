import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Event } from '../../models/event';
import EventService from '../../services/events';
import Grid from '@mui/material/Grid';

function EventDescription( { event }: { event: Event } ) {
	if ( ! event.participant_max ) {
		return null;
	}

	const description = `Participants: ${ event.participant_nb } / ${ event.participant_max }`;

	return <Typography variant="body2">{ description }</Typography>;
}

export default function ListEventPage() {
	const [ items, setItems ] = useState< Event[] >( [] );

	useEffect( () => {
		EventService.items().then(
			( data: { items: Event[]; total: number } ) => {
				setItems( data.items );
			}
		);
	}, [] );

	return (
		<div className="wrap">
			<h1>List of events</h1>
			<div>
				{ items.length === 0 && (
					<p>No events found. Please create one.</p>
				) }
				{ items.length > 0 && (
					<Grid container spacing={ 2 }>
						{ items.map( ( item ) => (
							<Grid key={ item.id } size={ 3 }>
								<Paper sx={ { marginBottom: 2, padding: 2 } }>
									<Typography variant="h6">
										{ item.title }
									</Typography>
									<EventDescription event={ item } />
									<Link to={ `/${ item.id }` }>
										View Details
									</Link>
								</Paper>
							</Grid>
						) ) }
					</Grid>
				) }
			</div>
		</div>
	);
}
