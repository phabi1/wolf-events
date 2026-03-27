import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useCallback, useMemo } from "react";

export type EventParticipantListProps = {
  participants: any[];
  fields?: any[];
  onParticipantEdit?: (participantId: string) => void;
  onParticipantDelete?: (participantId: string) => void;
};

export default function EventParticipantList({
  participants,
  fields,
  onParticipantEdit,
  onParticipantDelete,
}: EventParticipantListProps) {
  const handleEditParticipant = useCallback(
    (participantId: string) => {
      onParticipantEdit && onParticipantEdit(participantId);
    },
    [onParticipantEdit],
  );

  const handleDeleteParticipant = useCallback(
    (participantId: string) => {
      onParticipantDelete && onParticipantDelete(participantId);
    },
    [onParticipantDelete],
  );

  const columns: any[] = useMemo(() => {
    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "firstname", headerName: "Firstname", width: 130 },
      { field: "lastname", headerName: "Lastname", width: 130 },
      {
        field: "ticket",
        headerName: "Ticket",
        width: 130,
        valueGetter: (value: any, row: any) => {
          return row.ticket ? row.ticket.title : "";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: any) => {
          return (
            <div>
              {onParticipantEdit && (
                <Button onClick={() => handleEditParticipant(params.row.id)}>
                  Edit
                </Button>
              )}
              {onParticipantDelete && (
                <Button onClick={() => handleDeleteParticipant(params.row.id)}>
                  Delete
                </Button>
              )}
            </div>
          );
        },
      },
    ];
    if (fields) {
      fields.forEach((field) => {
        columns.splice(columns.length - 1, 0, {
          field: `field_${field.name}`,
          headerName: field.label,
          width: 130,
          valueGetter: (value: any, row: any) => {
            const participantField = row.fields[field.name];
            if (participantField) {
              return participantField;
            }
            return "";
          }
        });
      });
    }
    return columns;
  }, [
    fields,
    handleEditParticipant,
    handleDeleteParticipant,
    onParticipantEdit,
    onParticipantDelete,
  ]);

  return (
    <Paper>
      <DataGrid
        rows={participants}
        columns={columns}
        pageSizeOptions={[50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
