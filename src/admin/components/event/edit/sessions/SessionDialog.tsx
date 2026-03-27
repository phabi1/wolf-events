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

export default function SessionDialog({
  isOpen,
  onClose,
  selectedSession,
}: any) {
  const form = useForm({
    defaultValues: {
      title: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    if (selectedSession) {
      form.reset({
        title: selectedSession.title,
        start_date: selectedSession.start_date,
        end_date: selectedSession.end_date,
      });
    } else {
      form.reset({
        title: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [selectedSession, form]);

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
        <DialogTitle>Edit Session</DialogTitle>
        <DialogContent>
          <InputField name={`title`} label="Title" />
          <Stack spacing={2} mt={2}>
            <InputField name={`start_date`} label="Start Date" type="date" />
            <InputField name={`end_date`} label="End Date" type="date" />
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
