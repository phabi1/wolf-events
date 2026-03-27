import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import events from "../../services/events";
import InputField from "../forms/fields/InputField";
import SelectField from "../forms/fields/SelectField";

export type ParticipantFormProps = {
  eventId: string;
  form: any;
};

export default function ParticipantForm({
  eventId,
  form,
}: ParticipantFormProps) {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]); // Placeholder for tickets state
  const [fields, setFields] = useState<any[]>([]); // Placeholder for custom fields state

  useEffect(() => {
    events
      .item(eventId)
      .then((data) => {
        setTickets(data.tickets || []);
        setFields(data.participant_fields || []);
      })
      .then(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <InputField
          name="firstname"
          control={form.control}
          label="First Name"
        />
        <InputField name="lastname" control={form.control} label="Last Name" />
      </Box>
      <SelectField
        name="ticket_id"
        control={form.control}
        label="Ticket"
        options={tickets.map((ticket) => ({
          value: ticket.id,
          label: ticket.title,
        }))}
      />
      {fields.map((field) => (
        <InputField
          key={field.name}
          name={`fields.${field.name}`}
          control={form.control}
          label={field.label}
        />
      ))}
    </>
  );
}
