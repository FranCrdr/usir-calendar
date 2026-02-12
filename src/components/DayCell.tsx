import React, { useState } from 'react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';

interface DayCellProps {
  shiftDay: ShiftDay;
  onTap: (day: ShiftDay) => void;
  onLongPress: (day: ShiftDay) => void;
  isPaintMode: boolean;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  shiftDay,
  onTap,
  onLongPress,
  isPaintMode,
  isCurrentMonth
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    longPressTimer = setTimeout(() => {
      onLongPress(shiftDay);
      setIsPressed(false);
    }, 500);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      onTap(shiftDay);
    }
  };

  let longPressTimer: NodeJS.Timeout;

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes.trim().length > 0;

  return (
    <div
      className={`relative aspect-square bg-white cursor-pointer transition-all duration-200 ${
        isPressed ? 'scale-95 opacity-80' : ''
      } ${isPaintMode ? 'cursor-paint' : ''}`}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`h-full flex flex-col items-center justify-center rounded-lg border-2 border-transparent transition-all ${
          shiftColor
        } ${isCurrentMonth ? 'opacity-100' : 'opacity-50'}`}
      >
        {/* Date Number */}
        <div className={`text-xs font-medium absolute top-1 right-1 ${
          shiftDay.shiftType === ShiftType.FREE ? 'text-gray-400' : 'text-gray-700'
        }`}>
          {dayNumber}
        </div>

        {/* Shift Letter */}
        {shiftDay.shiftType !== ShiftType.FREE && (
          <div className="text-2xl font-bold leading-none">
            {shiftDay.shiftType}
          </div>
        )}

        {/* Notes Indicator */}
        {hasNotes && (
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default DayCell;