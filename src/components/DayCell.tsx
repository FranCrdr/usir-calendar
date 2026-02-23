"use client";

import React from 'react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';

interface DayCellProps {
  shiftDay: ShiftDay;
  onDayClick: (day: ShiftDay) => void;
  onNoteClick: (day: ShiftDay) => void;
  isPaintMode: boolean;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  shiftDay,
  onDayClick,
  onNoteClick,
  isPaintMode,
  isCurrentMonth
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPaintMode) {
      onDayClick(shiftDay);
    } else {
      onNoteClick(shiftDay);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPaintMode) return;
    e.stopPropagation();
    onNoteClick(shiftDay);
  };

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes && shiftDay.notes.trim().length > 0;

  // Estilo base para el día libre en modo oscuro
  const isFree = shiftDay.shiftType === ShiftType.FREE;
  const cellBg = isFree ? 'bg-transparent' : shiftColor;
  const borderColor = isFree ? 'border-white/5' : 'border-transparent';

  return (
    <div
      className={`relative h-full w-full cursor-pointer transition-all select-none touch-manipulation ${
        isPaintMode ? 'active:scale-95' : 'hover:bg-white/5'
      } ${isCurrentMonth ? 'opacity-100' : 'opacity-30'}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`h-full w-full flex flex-col items-center justify-center rounded-lg sm:rounded-xl border ${borderColor} ${cellBg} transition-colors duration-300`}>
        {/* Fecha - Blanco radiante y negrita */}
        <div className={`text-[10px] sm:text-[11px] font-black absolute top-1 right-1 sm:top-1.5 sm:right-1.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] ${
          isCurrentMonth ? 'text-white' : 'text-white/20'
        }`}>
          {dayNumber}
        </div>

        {/* Tipo de turno */}
        {!isFree && (
          <div className="text-xs sm:text-sm font-black drop-shadow-md text-white">{shiftDay.shiftType}</div>
        )}

        {/* Indicador de nota */}
        {hasNotes && (
          <div className="absolute inset-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10 p-0.5 flex flex-col overflow-hidden shadow-lg pointer-events-none">
            <p className="text-[7px] sm:text-[8px] text-white/90 leading-tight break-words line-clamp-2 sm:line-clamp-3">
              {shiftDay.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;