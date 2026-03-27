import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo } from "react";
import { styled } from "@mui/material/styles";

function fomatTitle(title: string, count: number, max: number | null) {
  if (max !== null) {
    return `${title} - ${count} / ${max}`;
  }
  count = count || 0;
  return `${title} - ${count}`;
}

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2)}€`;
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function EventTicketSummary({
  tickets,
  maxParticipants,
}: {
  tickets: any[];
  maxParticipants: number | null;
}) {
  const totalParticipants = useMemo(
    () =>
      tickets.reduce((sum, ticket) => sum + (ticket.participant_nb || 0), 0),
    [tickets],
  );

  const label = useMemo(() => {
    if (maxParticipants !== null) {
      return `${totalParticipants} / ${maxParticipants}`;
    }
    return `${totalParticipants}`;
  }, [totalParticipants, maxParticipants]);

  const data = useMemo(() => {
    const totalParticipants = tickets.reduce(
      (sum, ticket) => sum + (ticket.participant_nb || 0),
      0,
    );

    const chartData = tickets.map((ticket) => ({
      name: ticket.title,
      value: ticket.participant_nb || 0,
      fill: `hsl(${(ticket.id * 137.508) % 360}, 70%, 50%)`,
      percentage:
        totalParticipants > 0
          ? ((ticket.participant_nb || 0) / totalParticipants) * 100
          : 0,
    }));
    chartData.push({
      name: "Free",
      value: maxParticipants !== null ? maxParticipants - totalParticipants : 0,
      fill: "#ccc",
      percentage:
        maxParticipants !== null
          ? ((maxParticipants - totalParticipants) / maxParticipants) * 100
          : 0,
    });
    return chartData;
  }, [tickets, maxParticipants]);

  return (
    <Stack direction="row">
      <List>
        {tickets.map((ticket) => (
          <ListItem key={ticket.id}>
            <ListItemText
              primary={fomatTitle(
                ticket.title,
                ticket.participant_nb,
                ticket.participant_max,
              )}
              secondary={`Price: ${formatPrice(ticket.amount)}`}
            />
          </ListItem>
        ))}
      </List>
      <PieChart
        series={[
          {
            paddingAngle: 5,
            innerRadius: "60%",
            outerRadius: "90%",
            data,
          },
        ]}
        hideLegend
      >
        <PieCenterLabel>{label}</PieCenterLabel>
      </PieChart>
    </Stack>
  );
}
