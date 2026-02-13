export type ShiftType = "T" | "L" | "R" | "A" | "I";

export const getShiftColor = (shiftType: ShiftType): string => {
  switch (shiftType) {
    case "T": return "bg-red-600 text-white";
    case "L": return "bg-green-200 text-green-800";
    case "R": return "bg-orange-300 text-orange-800";
    case "A": return "bg-purple-200 text-purple-800";
    case "I": return "bg-yellow-200 text-yellow-800";
    default: return "bg-gray-100 text-gray-500";
  }
};

export interface ShiftDay {
  id: string;
  date: Date;
  shiftType: ShiftType;
  notes: string;
}