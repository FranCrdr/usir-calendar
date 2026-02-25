"use client";

import React from 'react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';

interface DayCellProps {
  shiftDay: ShiftDay;
  onDayClick: (day: ShiftDay) => void;
  onNoteClick: (day: ShiftDay) => void;
  isPaintMode: boolean;
  isCurrentMonth: boolean;
  onPointerDown: () => void;
  onPointerEnter: () => void;
}

const DayCell: React.FC<DayCellProps> = ({
  shiftDay,
  onDayClick,
  onNoteClick,
  isPaintMode,
  isCurrentMonth,
  onPointerDown,
  onPointerEnter
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaintMode) {
      e.preventDefault();
      onPointerDown();
    }
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (isPaintMode) {
      onPointerEnter();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isPaintMode) {
      onNoteClick(shiftDay);
    }
  };

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes && shiftDay.notes.trim().length > 0;

  // Solo es transparente si el tipo es NONE
  const isEmpty = shiftDay.shiftType === ShiftType.NONE;
  const cellBg = isEmpty ? 'bg-transparent' : shiftColor;
  const borderColor = isEmpty ? 'border-white/5' : 'border-transparent';

  return (
    <div
      className={`relative h-full w-full cursor-pointer transition-all select-none touch-none ${
        isPaintMode ? 'active:scale-95' : 'hover:bg-white/5'
      } ${isCurrentMonth ? 'opacity-100' : 'opacity-30'}`}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onClick={handleClick}
      data-day-id={shiftDay.date.toISOString()}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`h-full w-full flex flex-col items-center justify-center rounded-lg sm:rounded-xl border ${borderColor} ${cellBg} transition-colors duration-300`}>
        {/* Fecha */}
        <div className={`text-[10px] sm:text-[11px] font-black absolute top-1 right-1 sm:top-1.5 sm:right-1.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] ${
          isCurrentMonth ? 'text-white' : 'text-white/20'
        }`}>
          {dayNumber}
        </div>

        {/* Tipo de turno */}
        {!isEmpty && (
          <div className="text-xs sm:text-sm font-black drop-shadow-md text-white">{shiftDay.shiftType}</div>
        )}

        {/* Indicador de nota - MEJORADO PARA LEGIBILIDAD */}
        {hasNotes && (
          <div className="absolute inset-x-0.5 bottom-0.5 bg-black/85 backdrop-blur-md rounded-md border border-white/20 p-1 flex flex-col overflow-hidden shadow-2xl pointer-events-none z-10">
            <p className="text-[9px] sm:text-[10px] font-bold text-white leading-tight break-words line-clamp-2 text-center">
              {shiftDay.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;