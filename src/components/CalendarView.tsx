import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftDay } from '../types/ShiftTypes';
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

    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: Date[] = [];

    // Días del mes anterior (en orden correcto: del último día hacia atrás)
    if (adjustedStart > 0) {
      const previousMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = adjustedStart; i > 0; i--) {
        days.push(new Date(year, month - 1, previousMonthLastDay - i + 1));
      }
    }

    // Días del mes actual
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
    
    return existing || {
      id: date.toISOString(),
      date,
      shiftType: 'L' as any,
      notes: ''
    };
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex-1 bg-white">
      {/* Header del calendario */}
      <div className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
          </div>
          
          <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 mt-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((date, index) => (
          <DayCell
            key={`${date.toISOString()}-${index}`}
            shiftDay={getShiftForDate(date)}
            onDayClick={onDayClick}
            onNoteClick={onNoteClick}
            isPaintMode={isPaintMode}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView;