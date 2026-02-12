import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Trash2 } from 'lucide-react';
import { ShiftType, ShiftPattern } from '../types/ShiftTypes';
import { loadPatternsFromStorage, savePatternsFromStorage } from '../utils/storage';
import { showSuccess, showError } from '../utils/toast';

interface TurnosViewProps {
  shiftDays: any[];
  setShiftDays: (days: any[]) => void;
  onClose: () => void;
}

const TurnosView: React.FC<TurnosViewProps> = ({ shiftDays, setShiftDays, onClose }) => {
  const [patterns, setPatterns] = useState<ShiftPattern[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const [newPattern, setNewPattern] = useState<ShiftType[]>([]);

  useEffect(() => {
    const savedPatterns = loadPatternsFromStorage();
    setPatterns(savedPatterns);
  }, []);

  const defaultPatterns: ShiftPattern[] = [
    {
      id: '1',
      name: '2x2 Clásico',
      pattern: [ShiftType.MORNING, ShiftType.MORNING, ShiftType.AFTERNOON, ShiftType.AFTERNOON, ShiftType.NIGHT, ShiftType.NIGHT, ShiftType.OFF, ShiftType.OFF],
      color: 'bg-blue-100'
    },
    {
      id: '2',
      name: 'Continua 4x4',
      pattern: [ShiftType.MORNING, ShiftType.AFTERNOON, ShiftType.NIGHT, ShiftType.OFF],
      color: 'bg-green-100'
    }
  ];

  const addShiftToPattern = (shiftType: ShiftType) => {
    setNewPattern([...newPattern, shiftType]);
  };

  const createPattern = () => {
    if (!newPatternName.trim()) {
      showError('Por favor ingresa un nombre para el patrón');
      return;
    }

    if (newPattern.length === 0) {
      showError('El patrón debe tener al menos un turno');
      return;
    }

    const newPatternObj: ShiftPattern = {
      id: Date.now().toString(),
      name: newPatternName,
      pattern: newPattern,
      color: 'bg-purple-100'
    };

    const updatedPatterns = [...patterns, newPatternObj];
    setPatterns(updatedPatterns);
    savePatternsFromStorage(updatedPatterns);

    setNewPatternName('');
    setNewPattern([]);
    setIsCreating(false);
    showSuccess('Patrón creado con éxito');
  };

  const deletePattern = (patternId: string) => {
    const updatedPatterns = patterns.filter(p => p.id !== patternId);
    setPatterns(updatedPatterns);
    savePatternsFromStorage(updatedPatterns);
    showSuccess('Patrón eliminado');
  };

  const applyPattern = (pattern: ShiftPattern, startDate: Date) => {
    // This would apply the pattern starting from the selected date
    showSuccess(`Patrón "${pattern.name}" aplicado desde ${startDate.toLocaleDateString()}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Patrones de Turnos</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {!isCreating ? (
            <>
              <button
                onClick={() => setIsCreating(true)}
                className="w-full p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Patrón
              </button>

              <div className="space-y-3">
                {[...defaultPatterns, ...patterns].map((pattern) => (
                  <div key={pattern.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{pattern.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => applyPattern(pattern, new Date())}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Aplicar patrón"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        {!defaultPatterns.some(p => p.id === pattern.id) && (
                          <button
                            onClick={() => deletePattern(pattern.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Eliminar patrón"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pattern.pattern.map((shift, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded text-center text-xs font-bold flex items-center justify-center ${
                            getShiftColor(shift)
                          }`}
                        >
                          {shift}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={newPatternName}
                onChange={(e) => setNewPatternName(e.target.value)}
                placeholder="Nombre del patrón"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <div className="grid grid-cols-4 gap-2">
                {[ShiftType.MORNING, ShiftType.AFTERNOON, ShiftType.NIGHT, ShiftType.OFF].map(type => (
                  <button
                    key={type}
                    onClick={() => addShiftToPattern(type)}
                    className={`p-3 rounded-lg text-center ${getShiftColor(type)}`}
                  >
                    <div className="text-lg font-bold">{type || '—'}</div>
                  </button>
                ))}
              </div>

              {newPattern.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Patrón actual:</h4>
                  <div className="flex flex-wrap gap-1">
                    {newPattern.map((shift, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded text-center text-xs font-bold flex items-center justify-center ${
                          getShiftColor(shift)
                        }`}
                      >
                        {shift}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={createPattern}
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg"
                >
                  Crear Patrón
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for shift colors
const getShiftColor = (shiftType: ShiftType): string => {
  switch (shiftType) {
    case ShiftType.MORNING:
      return "bg-yellow-200 text-yellow-800";
    case ShiftType.AFTERNOON:
      return "bg-pink-200 text-pink-800";
    case ShiftType.NIGHT:
      return "bg-cyan-200 text-cyan-800";
    case ShiftType.OFF:
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-gray-50 text-gray-400";
  }
};

export default TurnosView;