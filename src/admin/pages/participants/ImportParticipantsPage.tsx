import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import UiFileUpload from "../../components/ui/FileUpload";
import MappingFields from "../../components/ui/MappingFields";
import ParticipantService from "../../services/participants";
import useEventDetailsStore from "../../stores/event-details";

export default function ImportParticipantsPage() {
  const params = useParams();
  const [view, setView] = useState("import");
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({
    firstname: "",
    lastname: "",
  });
  const [fields, setFields] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<any[]>([]);
  const navigate = useNavigate();
  const refreshParticipants = useEventDetailsStore(
    (state) => state.refreshParticipants,
  );

  const handleClose = () => {
    navigate(-1);
  };

  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  const handleMappingChange = (fieldKey: string, mappedValue: string) => {
    setMapping((prevMapping) => ({
      ...prevMapping,
      [fieldKey]: mappedValue,
    }));
  };

  const handleImport = () => {
    setView("process");
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const data = results.data as any[];
          const mappedData = data
            .map((row) => {
              const mappedRow: any = {};
              Object.keys(mapping).forEach((key) => {
                mappedRow[key] = row[mapping[key]];
              });
              mappedRow.ticket_id = 1;
              return Object.keys(mappedRow).length > 0 ? mappedRow : null;
            })
            .filter((row) => row !== null);
          ParticipantService.bulkCreate(params.eventId!, mappedData)
            .then(() => {
              refreshParticipants(params.eventId!);
              navigate(-1);
            })
            .catch((err) => {
              console.error("Error importing participants:", err);
              navigate(-1);
              setFile(null);
            })
            .finally(() => {
              setFile(null);
            });
        },
      });
    }
  };

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const data = results.data as any[];
          if (data.length > 0) {
            const keys = Object.keys(data[0]);
            const newMapping = Object.keys(mapping).reduce(
              (acc, key) => {
                acc[key] = keys.includes(key) ? key : "";
                return acc;
              },
              {} as Record<string, string>,
            );
            setFields(keys);
            setMapping(newMapping);
            setSampleRows(data.slice(0, 5));
            setView("template");
          }
        },
      });
    }
  }, [file]);

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Import Participants</DialogTitle>
      <DialogContent>
        {view === "import" && (
          <UiFileUpload
            fileExtensions={[".csv"]}
            maxFileSize={1048576} // 1 MB
            onFileSelect={handleFileSelect}
          />
        )}
        {view === "template" && (
          <div>
            <MappingFields
              mapping={mapping}
              fields={fields}
              sampleRows={sampleRows}
              onMappingChange={handleMappingChange}
            />
          </div>
        )}
        {view === "process" && <div>Processing...</div>}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="primary" onClick={handleImport}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
