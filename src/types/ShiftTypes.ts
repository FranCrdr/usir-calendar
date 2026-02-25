export enum ShiftType {
  WORK = "T",
  FREE = "L", 
  REINFORCEMENT = "R",
  ALERT = "A",
  IMAGINARY = "I"
}

export function getShiftColor(shiftType: ShiftType): string {
  switch (shiftType) {
    case ShiftType.WORK: return "bg-red-600 text-white";
    case ShiftType.FREE: return "bg-green-500/40 text-white border-green-500/50";
    case ShiftType.REINFORCEMENT: return "bg-orange-300 text-orange-800";
    case ShiftType.ALERT: return "bg-purple-200 text-purple-800";
    case ShiftType.IMAGINARY: return "bg-yellow-200 text-yellow-800";
    default: return "bg-gray-100 text-gray-500";
  }
}

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