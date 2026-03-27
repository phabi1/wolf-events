import Stack from "@mui/material/Stack";
import InputField from "../../forms/fields/InputField";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function EventInformationsForm() {
  const { setValue, watch } = useFormContext();

  const hasRegistrationFields =
    watch("registration_start") || watch("registration_end");

  console.log("hasRegistrationFields", hasRegistrationFields);

  const [shownRegistrationFields, setShownRegistrationFields] = useState(
    hasRegistrationFields,
  );

  useEffect(() => {
    if (!shownRegistrationFields) {
      setValue("registration_start", "");
      setValue("registration_end", "");
    }
  }, [shownRegistrationFields]);

  return (
    <div>
      <InputField name="title" label="Title" />
      <Stack direction="row" spacing={2} mb={2}>
        <InputField
          name="event_start"
          label="Event Start"
          type="datetime-local"
        />
        <InputField name="event_end" label="Event End" type="datetime-local" />
      </Stack>
      <Switch
        checked={shownRegistrationFields}
        onChange={(e) => setShownRegistrationFields(e.target.checked)}
      />
      <Stack direction="row" spacing={2} mb={2}>
        <InputField
          name="registration_start"
          label="Registration Start"
          type="datetime-local"
        />
        <InputField
          name="registration_end"
          label="Registration End"
          type="datetime-local"
        />
      </Stack>
      <InputField
        name="participant_max"
        label="Max Participants"
        type="number"
      />
    </div>
  );
}
