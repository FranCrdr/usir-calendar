"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftDay, ShiftType } from '../types/ShiftTypes';
import DayCell from './DayCell';

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  shiftDays: ShiftDay[];
  onDayClick: (day: ShiftDay) => void;
  onNoteClick: (day: ShiftDay) => void;
  isPaintMode: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  setCurrentDate,
  shiftDays,
  onDayClick,
  onNoteClick,
  isPaintMode
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastPaintedId = useRef<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      lastPaintedId.current = null;
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: Date[] = [];

    if (adjustedStart > 0) {
      const previousMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = adjustedStart; i > 0; i--) {
        days.push(new Date(year, month - 1, previousMonthLastDay - i + 1));
      }
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const remainingCells = 42 - days.length;
    if (remainingCells > 0) {
      for (let i = 1; i <= remainingCells; i++) {
        days.push(new Date(year, month + 1, i));
      }
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getShiftForDate = (date: Date): ShiftDay => {
    const existing = shiftDays.find(day => 
      day.date.toDateString() === date.toDateString()
    );
    
    return existing || {
      id: date.toISOString(),
      date,
      shiftType: ShiftType.NONE, // Por defecto ahora es vacío/transparente
      notes: ''
    };
  };

  const handleStartDragging = (day: ShiftDay) => {
    if (!isPaintMode) return;
    setIsDragging(true);
    lastPaintedId.current = day.id;
    onDayClick(day);
  };

  const handleEnterDay = (day: ShiftDay) => {
    if (!isPaintMode || !isDragging || lastPaintedId.current === day.id) return;
    lastPaintedId.current = day.id;
    onDayClick(day);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPaintMode || !isDragging) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    let current = element;
    while (current && current !== gridRef.current) {
      const dayId = current.getAttribute('data-day-id');
      if (dayId) {
        const day = days.find(d => d.toISOString() === dayId);
        if (day && lastPaintedId.current !== dayId) {
          const shiftDay = getShiftForDate(day);
          lastPaintedId.current = dayId;
          onDayClick(shiftDay);
        }
        break;
      }
      current = current.parentElement;
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 sm:py-6 px-4 sm:px-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigateMonth('prev')} 
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-white">
              {monthNames[currentDate.getMonth()]} <span className="text-white/40">{currentDate.getFullYear()}</span>
            </h1>
          </div>
          
          <button 
            onClick={() => navigateMonth('next')} 
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 mt-4 sm:mt-6">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-[9px] sm:text-[10px] font-black text-white/30 py-1 tracking-widest">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-7 grid-rows-6 gap-px bg-white/5 flex-1 touch-none"
        onTouchMove={handleTouchMove}
      >
        {days.map((date, index) => (
          <DayCell
            key={`${date.toISOString()}-${index}`}
            shiftDay={getShiftForDate(date)}
            onDayClick={onDayClick}
            onNoteClick={onNoteClick}
            isPaintMode={isPaintMode}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
            onPointerDown={() => handleStartDragging(getShiftForDate(date))}
            onPointerEnter={() => handleEnterDay(getShiftForDate(date))}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView;