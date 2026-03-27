import useModal from "../../hooks/use-modal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function UiConfirmDialog({
  title,
  content,
  onConfirm,
  onCancel,
  code,
}: {
  title: string;
  content: string;
  code?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { isOpen, closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
        {code && <pre>{code}</pre>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Confirm</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
