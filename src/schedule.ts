export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export type Weekday = (typeof DAYS)[number];

export const SHIFT_OPTIONS = ["8:00 AM", "9:00 AM", "5:00 PM", "6:30 PM"] as const;
export type ShiftOption = (typeof SHIFT_OPTIONS)[number];

export type ShiftSchedule = Record<number, Record<Weekday, ShiftOption>>;

export const buildDefaultSchedule = (): ShiftSchedule => {
  const schedule = {} as ShiftSchedule;
  for (let week = 1; week <= 5; week += 1) {
    schedule[week] = {
      Monday: "8:00 AM",
      Tuesday: "8:00 AM",
      Wednesday: "8:00 AM",
      Thursday: "8:00 AM",
      Friday: "8:00 AM"
    };
  }
  return schedule;
};

const CYCLE_REFERENCE_MONDAY = new Date("2025-01-06T00:00:00");

export const getCurrentCyclePosition = (now = new Date()) => {
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;

  let effectiveDate = new Date(now);
  if (day === 0) {
    effectiveDate.setDate(now.getDate() - 2);
  }
  if (day === 6) {
    effectiveDate.setDate(now.getDate() - 1);
  }

  const diffMs = effectiveDate.getTime() - CYCLE_REFERENCE_MONDAY.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weekdayIndex = (effectiveDate.getDay() + 6) % 7;
  const workingDayIndex = Math.min(weekdayIndex, 4);
  const cycleDay = diffDays - Math.floor(diffDays / 7) * 2;
  const week = (((Math.floor(cycleDay / 5) % 5) + 5) % 5) + 1;

  return {
    week,
    dayIndex: workingDayIndex,
    day: DAYS[workingDayIndex],
    isWeekend
  };
};

export const serializeWidgetPayload = (schedule: ShiftSchedule) => {
  const position = getCurrentCyclePosition();
  return JSON.stringify({ schedule, position, days: DAYS });
};
