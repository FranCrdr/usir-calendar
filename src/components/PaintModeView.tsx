import React from 'react';
import { X, Paintbrush, RotateCcw, Eraser } from 'lucide-react';
import { ShiftType, getShiftColor } from '../types/ShiftTypes';

interface PaintModeViewProps {
  selectedShift: ShiftType | 'B';
  onSelectShift: (shift: ShiftType | 'B') => void;
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
    onClose();
  };

  const handleEraserSelect = () => {
    onSelectShift('B');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4 z-50">
      <div className="bg-[#0a0a0c]/90 backdrop-blur-2xl rounded-3xl w-full max-w-md overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
              <Paintbrush className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Modo Pintar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start">
              <RotateCcw className="w-4 h-4 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-100/80">
                <p className="font-bold text-blue-300">¡Funcionalidad mejorada!</p>
                <p className="mt-1">Toca un día para pintarlo. Si vuelves a tocarlo, se borrará el turno.</p>
              </div>
            </div>
          </div>

          {/* Botón Borrar */}
          <div className="mb-6">
            <button
              onClick={handleEraserSelect}
              className={`w-full p-4 rounded-2xl text-center transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                selectedShift === 'B' 
                  ? 'bg-red-500/20 text-white border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-[1.02]' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center">
                <Eraser className="w-6 h-6 mr-2" />
                <span className="text-lg font-black uppercase tracking-wider">Borrar</span>
              </div>
              <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Limpia el turno del día</div>
            </button>
          </div>

          {/* Opciones de turnos */}
          <div className="grid grid-cols-2 gap-3">
            {shiftOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleShiftSelect(option.type)}
                className={`p-4 rounded-2xl text-center transition-all border-2 ${
                  getShiftColor(option.type)
                } ${
                  selectedShift === option.type 
                    ? 'ring-4 ring-blue-500/30 border-white scale-[1.02] shadow-lg' 
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title={option.description}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-xl font-black">{option.type}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{option.label}</div>
              </button>
            ))}
          </div>

          {/* Botón Cancelar */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintModeView;