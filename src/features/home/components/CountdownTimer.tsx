import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: Date;
  durationHours?: number;
  variant?: "inline" | "circular";
  onComplete?: () => void;
}

export const CountdownTimer = ({
  targetDate,
  durationHours,
  variant = "inline",
}: CountdownTimerProps) => {
  const { t } = useTranslation();
  const [target] = useState(() => {
    if (targetDate) return targetDate;
    const d = new Date();
    d.setHours(d.getHours() + (durationHours || 24));
    return d;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = (): TimeLeft => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    
    const frame = requestAnimationFrame(() => {
      setTimeLeft(calculate());
    });

    const id = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (variant === "circular") {
    return (
      <div className="flex gap-4 md:gap-6">
        {[
          { label: t("common.time.days"), value: timeLeft.days },
          { label: t("common.time.hours"), value: timeLeft.hours },
          { label: t("common.time.minutes"), value: timeLeft.minutes },
          { label: t("common.time.seconds"), value: timeLeft.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-lg"
          >
            <span className="text-black font-bold text-[16px] md:text-[20px] font-poppins leading-none">
              {pad(unit.value)}
            </span>
            <span className="text-black text-[10px] md:text-[11px] font-normal font-poppins">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 h-12.5">
      {[
        { label: t("common.time.days"), value: timeLeft.days },
        { label: t("common.time.hours"), value: timeLeft.hours },
        { label: t("common.time.minutes"), value: timeLeft.minutes },
        { label: t("common.time.seconds"), value: timeLeft.seconds },
      ].map((unit, index, array) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-start min-w-11.5">
            <span className="text-[12px] text-black font-medium leading-4.5 font-poppins mb-1">
              {unit.label}
            </span>
            <span className="text-[32px] text-black font-bold leading-7.5 tracking-[0.04em] font-inter tabular-nums">
              {pad(unit.value)}
            </span>
          </div>
          {index < array.length - 1 && (
            <div className="flex flex-col gap-2 h-7.5 justify-center mt-auto mb-1 px-1">
              <div className="w-1 h-1 rounded-full bg-[#E07575]" />
              <div className="w-1 h-1 rounded-full bg-[#E07575]" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
