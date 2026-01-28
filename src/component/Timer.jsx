import { useEffect } from "react";
import { useNow } from "../hooks/useNow";

function Timer({ endTime, onEnd }) {
  const now = useNow(); // only Timer listens to clock
  const timeLeft = endTime - now;

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
    }
  }, [timeLeft, onEnd]);

  if (timeLeft <= 0) {
    return <span className="text-rose-500 text-sm">Auction ended</span>;
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="text-slate-500 text-sm">
      Time left: {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}

export default Timer;
