import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ShiftDay } from '../types/ShiftTypes';

interface NoteModalProps {
  shiftDay: ShiftDay;
  onSave: (note: string) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ shiftDay, onSave, onClose }) => {
  const [note, setNote] = useState(shiftDay.notes || '');

  useEffect(() => {
    setNote(shiftDay.notes || '');
  }, [shiftDay]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Nota para {formatDate(shiftDay.date)}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Textarea simple y directo */}
        <div className="p-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[150px]"
            autoFocus
          />
        </div>

        {/* Footer - Botones simples */}
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

export default NoteModal;