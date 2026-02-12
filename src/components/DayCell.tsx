import React, { useState, useRef } from 'react';
import { Edit3 } from 'lucide-react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';

interface DayCellProps {
  shiftDay: ShiftDay;
  onTap: (day: ShiftDay) => void;
  onLongPress: (day: ShiftDay) => void;
  onDayNoteTap: (day: ShiftDay) => void;
  isPaintMode: boolean;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  shiftDay,
  onTap,
  onLongPress,
  onDayNoteTap,
  isPaintMode,
  isCurrentMonth
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shiftOptions = [
    { type: ShiftType.WORK, label: 'Trabajo', icon: '🛠️' },
    { type: ShiftType.FREE, label: 'Libre', icon: '🏖️' },
    { type: ShiftType.REINFORCEMENT, label: 'Refuerzo', icon: '💪' },
    { type: ShiftType.ALERT, label: 'Alerta', icon: '🚨' },
    { type: ShiftType.IMAGINARY, label: 'Imaginaria', icon: '✨' }
  ];

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      // Largo press - abrir editor completo
      if (onLongPress) {
        onLongPress(shiftDay);
      }
      setShowSelector(false); // Asegurar que el selector no se muestre simultáneamente
    }, 500);
  };

  const handleTouchEnd = () => {
    // Limpiar el timer del largo press
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Si estamos en modo pintar, aplicar el turno directamente
    if (isPaintMode && onTap) {
      onTap(shiftDay);
      return;
    }
    
    // Para clics normales, mostrar el selector después de un breve retraso
    clickTimerRef.current = setTimeout(() => {
      setShowSelector(true);
    }, 150);
  };

  const handleShiftSelect = (shiftType: ShiftType) => {
    const updatedDay = {
      ...shiftDay,
      shiftType: shiftType
    };
    
    if (onTap) {
      onTap(updatedDay);
    }
    setShowSelector(false);
  };

  const handleAddNote = () => {
    if (onDayNoteTap) {
      onDayNoteTap(shiftDay);
      setShowSelector(false);
    }
  };

  const handleClick = () => {
    // Limpiar cualquier timer pendiente
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    
    // Doble clic rápido para abrir directamente notas
    if (!isPaintMode) {
      setShowSelector(true);
    }
  };

  const handleDoubleClick = () => {
    // Doble clic para anotación rápida
    if (onDayNoteTap && !isPaintMode) {
      // Limpiar timer de clic simple
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      setShowSelector(false);
      onDayNoteTap(shiftDay);
    }
  };

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes && shiftDay.notes.trim().length > 0;
  const shortNote = hasNotes ? shiftDay.notes.substring(0, 20) + (shiftDay.notes.length > 20 ? '...' : '') : '';

  return (
    <>
      <div
        className={`relative aspect-square bg-white cursor-pointer transition-all duration-200 ${isPaintMode ? 'cursor-paint hover:scale-105 transition-transform' : 'hover:bg-gray-50'}`}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className={`h-full flex flex-col items-center justify-center rounded-lg border-2 border-transparent transition-all ${
            shiftColor
          } ${isCurrentMonth ? 'opacity-100' : 'opacity-50'} ${isPaintMode ? 'hover:border-blue-400' : ''}`}
        >
          {/* Date Number */}
          <div className={`text-xs font-medium absolute top-1 right-1 ${
            shiftDay.shiftType === ShiftType.FREE ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {dayNumber}
          </div>

          {/* Shift Letter */}
          {shiftDay.shiftType !== ShiftType.FREE && (
            <div className="text-sm font-bold leading-none">
              {shiftDay.shiftType}
            </div>
          )}

          {/* Notes Indicator and Preview */}
          {hasNotes && (
            <div className="absolute bottom-0 left-0 right-0 px-1">
              <div className="bg-black bg-opacity-80 rounded-b-lg px-2 py-1">
                <p className="text-[9px] text-white text-center font-medium leading-tight truncate select-none">
                  {shortNote}
                </p>
              </div>
            </div>
          )}

          {/* Indicador de nota con icono */}
          {hasNotes && !shortNote && (
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          )}

          {/* Indicador de modo pintar activo */}
          {isPaintMode && (
            <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      </div>

      {/* Selector Overlay */}
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold">¿Qué quieres hacer?</h3>
              <p className="text-sm text-gray-600">
                {shiftDay.date.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>

            {/* Botón rápido para añadir nota */}
            <button
              onClick={handleAddNote}
              className="w-full p-4 mb-4 bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              {hasNotes ? 'Editar Nota' : 'Añadir Nota'}
            </button>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {shiftOptions.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => handleShiftSelect(type)}
                  className={`p-3 rounded-lg text-center transition-all min-h-[80px] ${
                    getShiftColor(type)
                  } ${
                    shiftDay.shiftType === type 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : 'hover:opacity-90'
                  }`}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-lg font-bold">{type}</div>
                  <div className="text-xs mt-1">{label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSelector(false)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DayCell;