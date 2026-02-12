export enum ShiftType {
  MORNING = "M",
  AFTERNOON = "T",
  NIGHT = "N",
  OFF = ""
}

export const getShiftColor = (shiftType: ShiftType): string => {
  switch (shiftType) {
    case ShiftType.MORNING:
      return "bg-yellow-200 text-yellow-800";
    case ShiftType.AFTERNOON:
      return "bg-pink-200 text-pink-800";
    case ShiftType.NIGHT:
      return "bg-cyan-200 text-cyan-800";
    case ShiftType.OFF:
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-gray-50 text-gray-400";
  }
};

export interface ShiftDay {
  id: string;
  date: Date;
  shiftType: ShiftType;
  notes: string;
}

export interface ShiftPattern {
  id: string;
  name: string;
  pattern: ShiftType[];
  color: string;
}