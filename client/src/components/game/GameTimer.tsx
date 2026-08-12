import {
  useEffect,
  useState,
} from 'react';

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

    const timer =
      window.setInterval(() => {
        setTimeLeft(
          (current) =>
            current - 1,
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [timeLeft]);

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  return (
    <div
      className="
        flex
        min-h-24
        flex-col
        justify-center
        rounded-2xl
        border
        border-[#9b5cff]/40
        bg-[#11131f]/85
        px-5
        py-3
        text-center
        shadow-xl
        backdrop-blur-md
      "
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8d91a5]">
        Temps restant
      </span>

      <strong className="mt-1 text-3xl font-bold text-[#36d8ff]">
        {minutes}:
        {seconds
          .toString()
          .padStart(2, '0')}
      </strong>
    </div>
  );
}