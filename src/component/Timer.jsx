import { useEffect, useState } from "react";

function Timer({ endTime, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onEnd();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]); // ✅ only depend on endTime

  if (timeLeft <= 0) {
    return <span className="text-rose-500 text-sm">Auction ended</span>;
  }

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="text-slate-500 text-sm">
      Time left: {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}

export default Timer;
