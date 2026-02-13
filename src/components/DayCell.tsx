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
    e.stopPropagation();
    
    // Si estamos en modo pintura, cambia el tipo de turno
    if (isPaintMode) {
      onDayClick(shiftDay);
      return;
    }
    
    // Si no hay nota, abre el modal de notas
    if (!shiftDay.notes?.trim()) {
      onNoteClick(shiftDay);
    } else {
      // Si ya hay nota, también abre el modal para editar
      onNoteClick(shiftDay);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Doble clic siempre abre el modal de notas
    onNoteClick(shiftDay);
  };

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes && shiftDay.notes.trim().length > 0;

  return (
    <div
      className={`relative aspect-square bg-white cursor-pointer transition-all ${
        isPaintMode ? 'hover:scale-105' : 'hover:bg-gray-50'
      } ${isCurrentMonth ? 'opacity-100' : 'opacity-50'}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className={`h-full flex flex-col items-center justify-center rounded-lg border-2 ${shiftColor}`}>
        {/* Fecha */}
        <div className={`text-xs font-medium absolute top-1 right-1 ${
          shiftDay.shiftType === ShiftType.FREE ? 'text-gray-400' : 'text-gray-700'
        }`}>
          {dayNumber}
        </div>

        {/* Tipo de turno */}
        {shiftDay.shiftType !== ShiftType.FREE && (
          <div className="text-sm font-bold">{shiftDay.shiftType}</div>
        )}

        {/* Indicador de nota - Mejorado para mostrar más texto */}
        {hasNotes && (
          <div className="absolute inset-1 bg-white bg-opacity-90 rounded-md border border-gray-300 p-1 flex flex-col">
            <div className="flex-1 overflow-hidden">
              <p className="text-[9px] text-gray-800 leading-tight break-words max-h-full overflow-hidden">
                {shiftDay.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;