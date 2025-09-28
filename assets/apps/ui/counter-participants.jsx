import { useCallback, useState, useEffect } from "react";

export default function CounterParticipants({
  title,
  amount,
  min,
  max,
  onChange,
}) {
  const [localCount, setLocalCount] = useState(0);

  const handleIncrement = useCallback(() => {
    if (localCount < max) {
      const value = localCount + 1;
      setLocalCount(value);
      onChange(value);
    }
  }, [max, localCount]);

  const handleDecrement = useCallback(() => {
    if (localCount > min) {
      const value = localCount - 1;
      setLocalCount(value);
      onChange(value);
    }
  }, [min, localCount]);

  return (
    <div>
      <h3>{title}</h3>
      <h2>{amount}€</h2>
      <button onClick={handleDecrement}>-</button>
      <span>{localCount}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
