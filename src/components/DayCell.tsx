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
  const [showSelector, setShowSelector] = useState(false);

  const shiftOptions = [
    { type: ShiftType.WORK, label: 'Trabajo', icon: '🛠️' },
    { type: ShiftType.FREE, label: 'Libre', icon: '🏖️' },
    { type: ShiftType.REINFORCEMENT, label: 'Refuerzo', icon: '💪' },
    { type: ShiftType.ALERT, label: 'Alerta', icon: '🚨' },
    { type: ShiftType.IMAGINARY, label: 'Imaginaria', icon: '✨' }
  ];

  const handleTouchStart = () => {
    setIsPressed(true);
    longPressTimer = setTimeout(() => {
      // Verificar que onLongPress existe antes de llamarla
      if (onLongPress) {
        onLongPress(shiftDay);
      }
      setIsPressed(false);
    }, 500);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      
      // Mostrar selector al tocar rápidamente (no largo press)
      if (!isPaintMode && onTap) {
        setShowSelector(true);
      } else if (isPaintMode && onTap) {
        onTap(shiftDay);
      }
    }
  };

  const handleShiftSelect = (shiftType: ShiftType) => {
    const updatedDay = {
      ...shiftDay,
      shiftType: shiftType
    };
    
    // Actualizar inmediatamente el día seleccionado
    if (onTap) {
      onTap(updatedDay);
    }
    setShowSelector(false);
  };

  let longPressTimer: NodeJS.Timeout;

  const dayNumber = shiftDay.date.getDate();
  const shiftColor = getShiftColor(shiftDay.shiftType);
  const hasNotes = shiftDay.notes.trim().length > 0;

  return (
    <>
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

      {/* Selector Overlay */}
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold">Seleccionar Turno</h3>
              <p className="text-sm text-gray-600">
                {shiftDay.date.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

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
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 font-medium"
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