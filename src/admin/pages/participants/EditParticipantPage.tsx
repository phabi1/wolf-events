import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import ParticipantForm from "../../components/participant/ParticipantForm";
import ParticipantService from "../../services/participants";
import useEventDetailsStore from "../../stores/event-details";

type FormProps = {
  firstname: string;
  lastname: string;
  ticket_id: string;
  fields: Record<string, any>;
};

export default function EditParticipantPage() {
  const initialData: FormProps = {
    firstname: "",
    lastname: "",
    ticket_id: "",
    fields: {},
  };

  const params = useParams();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const refreshParticipants = useEventDetailsStore(
    (state) => state.refreshParticipants,
  );
  const form = useForm<FormProps>({
    defaultValues: initialData,
  });

  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSave = async (data: FormProps) => {
    try {
      await ParticipantService.update(params.eventId!, params.participantId!, {
        ...data,
      });

      // Handle success, e.g., show a success message or redirect
      setSnackbarMessage("Participant updated successfully!");
      setShowSnackbar(true);
    } catch (err) {
      setSnackbarMessage("Error updating participant.");
      setShowSnackbar(true);
    } finally {
      navigate(-1); // Go back to the previous page
      refreshParticipants(params.eventId!);
    }
  };

  useEffect(() => {
    ParticipantService.item(params.eventId!, params.participantId!).then(
      (data) => {
        console.log("Fetched participant data:", data);
        form.reset(data);
      },
    );
  }, [params.eventId, params.participantId]);

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Edit Participant</DialogTitle>
        <DialogContent>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <ParticipantForm eventId={params.eventId!} form={form} />
            </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            disabled={form.formState.isSubmitting}
          >
            Close
          </Button>
          <Button
            onClick={form.handleSubmit(handleSave)}
            color="primary"
            disabled={form.formState.isSubmitting}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
}
