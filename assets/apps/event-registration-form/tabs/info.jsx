import { useEffect, useMemo, useState } from "react";
import CounterParticipants from "../ui/counter-participants";
import Paginator from "../ui/paginator";

export default function InfoTab({ registration }) {
  const [prices, setPrices] = useState([]);

  const [participants, setParticipants] = useState(
    prices.map((price) => ({ id: price.id, count: 0 }))
  );

  useEffect(() => {
    setPrices(registration.prices);
    setParticipants(prices.map((price) => ({ id: price.id, count: 0 })));
  }, [registration.prices]);

  const totalParticipants = useMemo(() => {
    return participants.reduce(
      (sum, participant) => sum + participant.count,
      0
    );
  }, [participants]);

  const totalAmount = useMemo(() => {
    return participants.reduce((sum, participant) => {
      const price = prices.find((p) => p.id === participant.id)?.amount || 0;
      return sum + price * participant.count;
    }, 0);
  }, [participants, prices]);

  const handleParticipantChange = (id, count) => {
    setParticipants((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, count } : p));
      } else {
        return [...prev, { id, count }];
      }
    });
  };

  const handleSubmit = () => {
    const regParticipants = [];
    participants.forEach((participant) => {
      for (let i = 0; i < participant.count; i++) {
        regParticipants.push({ id: `${participant.id}-${i + 1}` });
      }
    });
    registration.setParticipants(regParticipants);
    registration.nextStep();
  };

  return (
    <div>
      <h2>Event Information</h2>
      <div>
        <div>
          {prices.map((price, index) => (
            <CounterParticipants
              title={price.label}
              key={index}
              amount={price.amount}
              min={0}
              max={10}
              onChange={(count) => handleParticipantChange(price.id, count)}
            />
          ))}
        </div>
      </div>
      <div>
        Total <span>{totalAmount}€</span>
      </div>
      <Paginator
        canPrevious={false}
        previous={null}
        canNext={totalParticipants > 0}
        next={handleSubmit}
      />
    </div>
  );
}
