import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import { ShiftDay, ShiftType, getShiftColor } from '../types/ShiftTypes';

interface ShiftEditorProps {
  shiftDay: ShiftDay;
  onSave: (day: ShiftDay) => void;
  onClose: () => void;
}

const ShiftEditor: React.FC<ShiftEditorProps> = ({ shiftDay, onSave, onClose }) => {
  const [editedDay, setEditedDay] = useState(shiftDay);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    setEditedDay(shiftDay);
  }, [shiftDay]);

  const shiftTypes = [
    { type: ShiftType.WORK, label: 'Trabajo', icon: '🛠️', description: 'Turno normal de trabajo' },
    { type: ShiftType.FREE, label: 'Libre', icon: '🏖️', description: 'Día libre' },
    { type: ShiftType.REINFORCEMENT, label: 'Refuerzo', icon: '💪', description: 'Turno de refuerzo' },
    { type: ShiftType.ALERT, label: 'Alerta', icon: '🚨', description: 'Alerta - Puerta norte/oficina' },
    { type: ShiftType.IMAGINARY, label: 'Imaginaria', icon: '✨', description: 'Turno imaginaria' }
  ];

  const handleSave = () => {
    onSave(editedDay);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Editar Turno</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-4">
            {formatDate(editedDay.date)}
          </div>

          {/* Shift Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Turno
            </label>
            <div className="grid grid-cols-3 gap-2">
              {shiftTypes.map(({ type, label, icon, description }) => (
                <button
                  key={type}
                  onClick={() => setEditedDay({ ...editedDay, shiftType: type })}
                  className={`p-3 rounded-lg text-center transition-all min-h-[80px] ${
                    getShiftColor(type)
                  } ${
                    editedDay.shiftType === type 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={description}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-lg font-bold">{type}</div>
                  <div className="text-xs mt-1">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Notas
              </label>
              <button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="flex items-center text-sm text-blue-600"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                {isEditingNotes ? 'Listo' : 'Editar'}
              </button>
            </div>
            
            {isEditingNotes ? (
              <textarea
                value={editedDay.notes}
                onChange={(e) => setEditedDay({ ...editedDay, notes: e.target.value })}
                placeholder="Añade notas para este día..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            ) : (
              <div 
                className="p-3 border border-transparent rounded-lg min-h-[80px] bg-gray-50"
                onClick={() => setIsEditingNotes(true)}
              >
                {editedDay.notes || (
                  <span className="text-gray-400">Toca para añadir notas...</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-gray-600 font-medium transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftEditor;