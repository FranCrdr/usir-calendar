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

  const today = new Date();
  const isToday = 
    shiftDay.date.getDate() === today.getDate() &&
    shiftDay.date.getMonth() === today.getMonth() &&
    shiftDay.date.getFullYear() === today.getFullYear();

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes && shiftDay.notes.trim().length > 0;

  const isEmpty = shiftDay.shiftType === ShiftType.NONE;
  const cellBg = isEmpty ? 'bg-transparent' : shiftColor;
  
  // Resplandor blanco radiante para hoy
  const borderColor = isToday 
    ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-30' 
    : (isEmpty ? 'border-white/5' : 'border-transparent');

  return (
    <div
      className={`relative h-full w-full cursor-pointer transition-all select-none touch-none ${
        isPaintMode ? 'active:scale-95' : 'hover:bg-white/5'
      } ${isCurrentMonth ? 'opacity-100' : 'opacity-30'} ${isToday ? 'scale-[1.05]' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onClick={handleClick}
      data-day-id={shiftDay.date.toISOString()}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`h-full w-full flex flex-col items-center justify-center rounded-lg sm:rounded-xl border-2 ${borderColor} ${cellBg} transition-all duration-300`}>
        {/* Indicador visual extra para hoy (punto blanco brillante) */}
        {isToday && (
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff] animate-pulse" />
        )}

        {/* Fecha con efecto Galaxia si es hoy */}
        <div className={`text-[11px] sm:text-[13px] font-black absolute top-1 right-1 sm:top-1.5 sm:right-1.5 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)] ${
          isToday ? 'animate-galaxy' : (isCurrentMonth ? 'text-white' : 'text-white/20')
        }`}>
          {dayNumber}
        </div>

        {/* Tipo de turno */}
        {!isEmpty && (
          <div className="text-xs sm:text-sm font-black drop-shadow-md text-white">{shiftDay.shiftType}</div>
        )}

        {/* Indicador de nota */}
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