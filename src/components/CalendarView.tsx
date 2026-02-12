import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';
import DayCell from './DayCell';

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  shiftDays: ShiftDay[];
  onDayTap: (day: ShiftDay) => void;
  onDayLongPress: (day: ShiftDay) => void;
  isPaintMode: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  setCurrentDate,
  shiftDays,
  onDayTap,
  onDayLongPress,
  isPaintMode
}) => {
  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Adjust for Monday as first day
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: Date[] = [];

    // Add empty days from previous month
    for (let i = 0; i < adjustedStart; i++) {
      days.push(new Date(year, month, -i));
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
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
    
    if (existing) return existing;

    return {
      id: date.toISOString(),
      date,
      shiftType: ShiftType.FREE,
      notes: ''
    };
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 mt-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid - Removed padding to maximize space */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((date, index) => (
          <DayCell
            key={`${date.toISOString()}-${index}`}
            shiftDay={getShiftForDate(date)}
            onTap={onDayTap}
            onLongPress={onLongPress}
            isPaintMode={isPaintMode}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
          />
        ))}
      </div>

      {isPaintMode && (
        <div className="bg-blue-50 py-2 px-4">
          <p className="text-blue-600 text-sm text-center">
            Modo pintar activo. Selecciona un turno y toca los días para aplicarlo rápidamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;