import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useCallback, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router";
import EventParticipantList from "../../components/event/ParticipantList";
import PrintService from "../../services/print";
import useEventDetailsStore from "../../stores/event-details";
import EventTicketSummary from "../../components/event/TicketSummary";
import EventSessionSummary from "../../components/event/SessionSummary";
import events from "../../services/events";

export default function DetailsEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const loading = useEventDetailsStore((state) => state.loading);
  const item = useEventDetailsStore((state) => state.event);
  const loadEvent = useEventDetailsStore((state) => state.loadEvent);
  const participants = useEventDetailsStore((state) => state.participants);
  const refreshParticipants = useEventDetailsStore(
    (state) => state.refreshParticipants,
  );

  useEffect(() => {
    if (eventId) {
      loadEvent(eventId).then(() => {
        refreshParticipants(eventId);
      });
    } else {
      navigate("/");
    }
  }, [eventId, navigate]);

  const handleParticipantEdit = useCallback(
    (participantId: string) => {
      navigate(`/${eventId}/participants/${participantId}/edit`);
    },
    [eventId, navigate],
  );

  const handleParticipantDelete = useCallback(
    (participantId: string) => {
      navigate(`/${eventId}/participants/${participantId}/delete`);
    },
    [eventId, navigate],
  );

  const handlePrintParticipants = useCallback(() => {
    PrintService.printPdf(eventId!).catch((err) => {
      console.error("Error printing participants:", err);
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
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1>{item.title}</h1>
                  <h2>Event details</h2>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/${eventId}/edit`}
                    sx={{ marginLeft: 2 }}
                  >
                    Edit event
                  </Button>
                </div>
              </Box>
              <h2>Default information</h2>
              <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <p>Type: {item.event_type}</p>
                <p>
                  Start:{" "}
                  {item.event_start ? item.event_start.toISOString() : null}
                </p>
                <p>
                  End: {item.event_end ? item.event_end.toISOString() : null}
                </p>
              </Paper>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <Paper sx={{ flex: 1, padding: 2 }}>
                  <h3>Sessions</h3>
                  <EventSessionSummary sessions={item.sessions} />
                </Paper>
                <Paper sx={{ flex: 1, padding: 2 }}>
                  <h3>Tickets</h3>
                  <EventTicketSummary tickets={item.tickets} maxParticipants={item.participant_max} />
                </Paper>
              </Box>
              <h2>Participants</h2>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  onParticipantEdit={handleParticipantEdit}
                  onParticipantDelete={handleParticipantDelete}
                />
              </div>
            </>
          )
        )}
      </div>
      <Outlet />
    </>
  );
}
