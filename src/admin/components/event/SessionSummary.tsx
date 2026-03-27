import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function EventSessionSummary({ sessions }: { sessions: any[] }) {
  return (
    <List>
      {sessions.map((session) => (
        <ListItem key={session.id}>
          <ListItemText
            primary={`${session.title}`}
            secondary={`Start: ${new Date(session.session_start).toLocaleString('fr-FR')} - End: ${new Date(session.session_end).toLocaleString('fr-FR')}`}
          />
        </ListItem>
      ))}
    </List>
  );
}