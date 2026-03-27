import { useFormContext } from "react-hook-form";

export default function EventParticipantsForm() {
  const { control } = useFormContext();
  return (
    <div>Participants</div>
  );
}