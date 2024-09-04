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
    <div className="flex items-center justify-end">
      <svg className="mr-1" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" ><path fillRule="evenodd" clipRule="evenodd" d="M5.35066 2.06247C5.96369 1.78847 6.62701 1.60666 7.32351 1.53473L7.16943 0.0426636C6.31208 0.1312 5.49436 0.355227 4.73858 0.693033L5.35066 2.06247ZM8.67651 1.53473C11.9481 1.87258 14.5 4.63876 14.5 8.00001C14.5 11.5899 11.5899 14.5 8.00001 14.5C4.63901 14.5 1.87298 11.9485 1.5348 8.67722L0.0427551 8.83147C0.459163 12.8594 3.86234 16 8.00001 16C12.4183 16 16 12.4183 16 8.00001C16 3.86204 12.8589 0.458666 8.83059 0.0426636L8.67651 1.53473ZM2.73972 4.18084C3.14144 3.62861 3.62803 3.14195 4.18021 2.74018L3.29768 1.52727C2.61875 2.02128 2.02064 2.61945 1.52671 3.29845L2.73972 4.18084ZM1.5348 7.32279C1.60678 6.62656 1.78856 5.96348 2.06247 5.35066L0.693033 4.73858C0.355343 5.4941 0.131354 6.31152 0.0427551 7.16854L1.5348 7.32279ZM8.75001 4.75V4H7.25001V4.75V7.875C7.25001 8.18976 7.3982 8.48615 7.65001 8.675L9.55001 10.1L10.15 10.55L11.05 9.35L10.45 8.9L8.75001 7.625V4.75Z" fill="currentColor"></path></svg>
      {`${Math.floor(
      time / 60
    )}:${time % 60}`}
   
    </div>
  );
});

Timer.displayName = "Timer";