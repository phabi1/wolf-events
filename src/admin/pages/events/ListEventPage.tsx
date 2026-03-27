import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Event } from "../../models/event";
import EventService from "../../services/events";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function ListEventPage() {
  const nagivate = useNavigate();
  const [items, setItems] = useState<Event[]>([]);

  const columns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "event_type", headerName: "Type", width: 130 },
    {
      field: "event_start",
      headerName: "Start Date",
      type: "date",
      width: 130,
    },
    {
      field: "event_end",
      headerName: "End Date",
      type: "date",
      width: 130,
    },
    {
      field: "participants",
      headerName: "Participants",
      width: 130,
      valueGetter: (value: any, row: any) => {
        if (row.participant_max !== null) {
          return `${row.participant_nb} / ${row.participant_max}`;
        }
        return row.participant_nb;
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  useEffect(() => {
    EventService.items().then((data: { items: Event[]; total: number }) => {
      setItems(data.items);
    });
  }, []);

  const handleRowClick = (params: any) => {
    const eventId = params.id;
    nagivate(`/${eventId}`);
  };

  return (
    <div className="wrap">
      <h1>List of events</h1>
      <div>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={items}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowClick={handleRowClick}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </div>
  );
}
