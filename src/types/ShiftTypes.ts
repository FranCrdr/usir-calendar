export enum ShiftType {
  WORK = "T",           // Trabajo
  FREE = "L",           // Libre
  REINFORCEMENT = "R", // Refuerzo
  ALERT = "A",         // Alerta - Puerta norte/oficina
  IMAGINARY = "I"      // Imaginaria
}

export const getShiftColor = (shiftType: ShiftType): string => {
  switch (shiftType) {
    case ShiftType.WORK:
      return "bg-red-200 text-red-800 border-red-300";
    case ShiftType.FREE:
      return "bg-green-200 text-green-800 border-green-300";
    case ShiftType.REINFORCEMENT:
      return "bg-emerald-600 text-white border-emerald-700";
    case ShiftType.ALERT:
      return "bg-purple-200 text-purple-800 border-purple-300";
    case ShiftType.IMAGINARY:
      return "bg-yellow-200 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
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