import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import EventInformationsForm from "../../components/event/edit/InformationsForm";
import EventParticipantsForm from "../../components/event/edit/ParticipantsForm";
import EventSessionsForm from "../../components/event/edit/SessionsForm";
import EventTicketsForm from "../../components/event/edit/TicketsForm";
import Form from "../../components/forms/Form";
import { EventDetails } from "../../models/event-details";
import events from "../../services/events";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type CustomTabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

type Session = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

type Ticket = {
  id: string;
  title: string;
  amount: number;
  participant_max: number;
};

type Participant = {
  name: string;
  type: string;
  options: Record<string, any>;
};

type EventInputs = {
  title: string;
  event_start: Date | null;
  event_end: Date | null;
  participant_max: number | null;
  participant_fields: Participant[];
  sessions: Session[];
  tickets: Ticket[];
};

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const [loading, setLoading] = useState(true);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const form = useForm<EventInputs>({
    defaultValues: {
      title: "",
      sessions: [],
      tickets: [],
      participant_fields: [],
      participant_max: null,
      event_start: new Date(),
      event_end: new Date(),
    },
    mode: "onChange",
  });

  const handleTabIndexChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      events.item(eventId).then((data) => {
        setEvent(data);
        form.reset({
          title: data.title,
          sessions: data.sessions,
          tickets: data.tickets,
          participant_fields: data.participant_fields,
          participant_max: data.participant_max,
          event_start: data.event_start ? new Date(data.event_start) : null,
          event_end: data.event_end ? new Date(data.event_end) : null,
        });
        setLoading(false);
      });
    }
  }, [eventId, form]);

  if (loading || !event) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data: EventInputs) => {
    await events.update(eventId!, data);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="wrap">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <div>
            <Link to={`/${eventId}`}>Back to details</Link>
            <h1>{event.title}</h1>
            <h2>Edit Event</h2>
          </div>
          <div>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </div>
        </Stack>
        <Paper>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTabIndex}
              onChange={handleTabIndexChange}
              aria-label="basic tabs example"
            >
              <Tab label="Default informations" {...a11yProps(0)} />
              <Tab label="Tickets" {...a11yProps(1)} />
              <Tab label="Sessions" {...a11yProps(2)} />
              <Tab label="Participants" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={currentTabIndex} index={0}>
            <EventInformationsForm />
          </CustomTabPanel>
          <CustomTabPanel value={currentTabIndex} index={1}>
            <EventTicketsForm />
          </CustomTabPanel>
          <CustomTabPanel value={currentTabIndex} index={2}>
            <EventSessionsForm />
          </CustomTabPanel>
          <CustomTabPanel value={currentTabIndex} index={3}>
            <EventParticipantsForm />
          </CustomTabPanel>
        </Paper>
      </div>
    </Form>
  );
}
