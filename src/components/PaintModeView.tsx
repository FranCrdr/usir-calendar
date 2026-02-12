import React from 'react';
import { X, Brush } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Brush className="w-5 h-5 text-blue-600 mr-2" />
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
          <p className="text-sm text-gray-600 mb-4">
            Selecciona un tipo de turno y toca los días del calendario para aplicarlo rápidamente.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {shiftOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => onSelectShift(option.type)}
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

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-sm text-center">
              Turno seleccionado: {shiftOptions.find(o => o.type === selectedShift)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintModeView;