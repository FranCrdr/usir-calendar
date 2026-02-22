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
      <div className={`h-full flex flex-col items-center justify-center rounded-lg border ${borderColor} ${cellBg} transition-colors duration-300 m-0.5`}>
        {/* Fecha - Blanco radiante y negrita */}
        <div className={`text-[10px] font-black absolute top-1 right-1.5 ${
          isCurrentMonth ? 'text-white' : 'text-white/20'
        }`}>
          {dayNumber}
        </div>

        {/* Tipo de turno */}
        {!isFree && (
          <div className="text-xs font-black drop-shadow-md text-white">{shiftDay.shiftType}</div>
        )}

        {/* Indicador de nota */}
        {hasNotes && (
          <div className="absolute inset-1 bg-black/40 backdrop-blur-sm rounded-md border border-white/10 p-0.5 flex flex-col overflow-hidden">
            <p className="text-[7px] text-white/80 leading-tight break-words line-clamp-2">
              {shiftDay.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;