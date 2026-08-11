import { useEffect, useState } from "react";

type GameTimerProps = {
  duration: number;
};

export default function GameTimer({
  duration,
}: GameTimerProps) {
  const [timeLeft, setTimeLeft] =
    useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <strong>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </strong>
    </div>
  );
}