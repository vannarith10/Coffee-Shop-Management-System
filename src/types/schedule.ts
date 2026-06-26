// types/schedule.ts
//

export type Schedule =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const SCHEDULE_CONFIG = {
  MONDAY: {
    label: "Mon",
  },
  TUESDAY: {
    label: "Tue",
  },
  WEDNESDAY: {
    label: "Wed",
  },
  THURSDAY: {
    label: "Thu",
  },
  FRIDAY: {
    label: "Fri",
  },
  SATURDAY: {
    label: "Sat",
  },
  SUNDAY: {
    label: "Sun",
  },
} as const;



export const DAY_ORDER: Schedule[] = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", 
  "FRIDAY", "SATURDAY", "SUNDAY"
];