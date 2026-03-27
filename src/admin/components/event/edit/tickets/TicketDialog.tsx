import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../../forms/fields/InputField";
import Form from "../../../forms/Form";

export default function TicketDialog({ isOpen, onClose, selectedTicket }: any) {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
      participant_max: 0,
    },
  });

  useEffect(() => {
    if (selectedTicket) {
      form.reset({
        title: selectedTicket.title,
        amount: selectedTicket.amount,
        participant_max: selectedTicket.participant_max,
      });
    } else {
      form.reset({
        title: "",
        amount: 0,
        participant_max: 0,
      });
    }
  }, [selectedTicket, form]);

  const handleDialogClose = (shouldSave: boolean, data?: any) => {
    if (shouldSave) {
      onClose(data);
    } else {
      onClose(null);
    }
    form.reset();
  };
  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit((data) => handleDialogClose(true, data))}
    >
      <Dialog
        open={isOpen}
        onClose={() => handleDialogClose(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Ticket</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <InputField name={`title`} label="Title" />
            <InputField name={`amount`} label="Amount" type="number" />
            <InputField
              name={`participant_max`}
              label="Participant Max"
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Close</Button>
          <Button
            type="button"
            variant="contained"
            onClick={form.handleSubmit((data) => handleDialogClose(true, data))}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
