export enum ShiftType {
  WORK = "T",
  FREE = "L", 
  REINFORCEMENT = "R",
  ALERT = "A",
  IMAGINARY = "I",
  NONE = "" // Estado para días no pintados
}

export function getShiftColor(shiftType: ShiftType): string {
  switch (shiftType) {
    case ShiftType.WORK: return "bg-red-600 text-white";
    case ShiftType.FREE: return "bg-green-500 text-white";
    case ShiftType.REINFORCEMENT: return "bg-orange-500 text-white"; // Naranja más intenso
    case ShiftType.ALERT: return "bg-purple-500 text-white";
    case ShiftType.IMAGINARY: return "bg-sky-400 text-white"; // Azul celeste claro
    default: return "bg-transparent text-gray-500";
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