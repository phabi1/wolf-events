import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ParticipantService from "../../services/participants";
import Snackbar from "@mui/material/Snackbar";
import useEventDetailsStore from "../../stores/event-details";

export default function DeleteParticipantPage() {
  const params = useParams();
  const eventId = params.eventId!;
  const participantId = params.participantId!;

  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const refreshParticipants = useEventDetailsStore(
    (state) => state.refreshParticipants,
  );

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setBusy(true);
    // Placeholder for delete participant logic

    try {
      await ParticipantService.delete(eventId, participantId);

      // Handle success, e.g., show a success message or redirect
      setSnackbarMessage("Participant deleted successfully!");
      setShowSnackbar(true);
    } catch (err) {
      console.error("Error deleting participant:", err);
      setSnackbarMessage("Error deleting participant.");
      setShowSnackbar(true);
    } finally {
      setBusy(false);
      setOpen(false);
      refreshParticipants(eventId);
    }
  };

  useEffect(() => {
    if (!open) {
      navigate(-1); // Go back to the previous page
    }
  }, [open, navigate]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Participant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this participant? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={busy}>
            Close
          </Button>
          <Button onClick={handleDelete} color="primary" disabled={busy}>
            Delete
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
