import { useEffect } from "react";
import { useRegistration } from "./hooks/use-registration";
import InfoTab from "./tabs/info";
import ParticipantsTab from "./tabs/participants";

export default function App() {
  const tabs = ["info", "participants"];

  const registration = useRegistration();

  useEffect(() => {
    registration.load();
  }, []);

  if (registration.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav>
        {tabs.map((tab) => (
          <button key={tab}>
            {tab}
          </button>
        ))}
      </nav>
      {registration.activeTab === "info" && (
        <InfoTab registration={registration} />
      )}
      {registration.activeTab === "participants" && (
        <ParticipantsTab registration={registration} />
      )}
    </div>
  );
}
