import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

export interface TimerRef {
  getTime: () => number;
}

export const Timer = forwardRef<
  TimerRef,
  { timeMin: number; onExpired: () => void }
>(({ timeMin, onExpired }, ref) => {
  const [time, setTime] = useState(timeMin * 60);

  useEffect(() => {
    const interval = setTimeout(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // when expired
    if (time <= 0) {
      clearTimeout(interval);
      onExpired();
    }

    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useImperativeHandle(ref, () => ({
    getTime: () => time,
  }));

  return (
    <div className="flex items-center justify-center">{`${Math.floor(
      time / 60
    )}:${time % 60}`}</div>
  );
});

Timer.displayName = "Timer";