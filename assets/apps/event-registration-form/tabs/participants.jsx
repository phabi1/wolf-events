import { useMemo } from "react";
import Paginator from "../ui/paginator";

export default function ParticipantsTab({ registration }) {
  const participants = useMemo(() => {
    return registration.participants || [];
  }, [registration.participants]);

  return (
    <div>
      <h2>Participants</h2>
      <div>
        {participants.map((participant, index) => (
          <div key={index}>
            <div>Firstname</div>
            <div>
              <input type="text" name={`firstname_${participant.id}`} />
            </div>
            <div>Lastname</div>
            <div>
              <input type="text" name={`lastname_${participant.id}`} />
            </div>
          </div>
        ))}
      </div>
      <Paginator
        canPrevious={true}
        previous={registration.previous()}
        canNext={false}
        next={null}
      />
    </div>
  );
}
