import React from 'react';
import { X, Paintbrush, RotateCcw } from 'lucide-react';
import { ShiftType, getShiftColor } from '../types/ShiftTypes';

interface PaintModeViewProps {
  selectedShift: ShiftType;
  onSelectShift: (shift: ShiftType) => void;
  onClose: () => void;
}

const PaintModeView: React.FC<PaintModeViewProps> = ({
  selectedShift,
  onSelectShift,
  onClose
}) => {
  const shiftOptions = [
    { type: ShiftType.WORK, label: 'Trabajo', icon: '🛠️', description: 'Turno normal de trabajo' },
    { type: ShiftType.FREE, label: 'Libre', icon: '🏖️', description: 'Día libre' },
    { type: ShiftType.REINFORCEMENT, label: 'Refuerzo', icon: '💪', description: 'Turno de refuerzo' },
    { type: ShiftType.ALERT, label: 'Alerta', icon: '🚨', description: 'Alerta - Puerta norte/oficina' },
    { type: ShiftType.IMAGINARY, label: 'Imaginaria', icon: '✨', description: 'Turno imaginaria' }
  ];

  const handleShiftSelect = (shiftType: ShiftType) => {
    onSelectShift(shiftType);
    // Se cierra automáticamente después de seleccionar
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Paintbrush className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Modo Pintar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <RotateCcw className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">¡Funcionalidad mejorada!</p>
                <p className="mt-1">Ahora puedes hacer clic nuevamente en un día pintado para revertirlo a su estado anterior.</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Selecciona un tipo de turno y podrás pintar días directamente en el calendario.
            Haz clic nuevamente en el mismo día para revertir el cambio.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {shiftOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleShiftSelect(option.type)}
                className={`p-4 rounded-lg text-center transition-all min-h-[100px] ${
                  getShiftColor(option.type)
                } ${
                  selectedShift === option.type 
                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={option.description}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-lg font-bold">{option.type}</div>
                <div className="text-sm opacity-80">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintModeView;