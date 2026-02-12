import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import { ShiftDay } from '../types/ShiftTypes';

interface NoteModalProps {
  shiftDay: ShiftDay;
  onSave: (note: string) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ shiftDay, onSave, onClose }) => {
  const [note, setNote] = useState(shiftDay.notes || '');
  const [isEditing, setIsEditing] = useState(!shiftDay.notes || shiftDay.notes.trim() === '');

  // Reiniciar estado cuando cambia el día
  useEffect(() => {
    setNote(shiftDay.notes || '');
    setIsEditing(!shiftDay.notes || shiftDay.notes.trim() === '');
  }, [shiftDay]);

  const handleSave = () => {
    if (onSave) {
      onSave(note.trim());
    }
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Enfocar automáticamente cuando se activa la edición
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Agregar Nota</h2>
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
            {formatDate(shiftDay.date)}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Notas del día
              </label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                {isEditing ? 'Listo' : 'Editar'}
              </button>
            </div>
            
            {isEditing ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Añade notas para este día (cumpleaños, eventos importantes, recordatorios...)"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  rows={4}
                  autoFocus
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Presiona Ctrl+Enter para guardar rápidamente</span>
                  <span>{note.length}/500 caracteres</span>
                </div>
              </>
            ) : (
              <div 
                className="p-3 border border-transparent rounded-lg min-h-[100px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {note && note.trim() ? (
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{note}</p>
                ) : (
                  <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full">
                    <Edit3 className="w-5 h-5 mb-2 opacity-50" />
                    <span>Toca para añadir notas...</span>
                  </div>
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
            disabled={!note.trim() && shiftDay.notes === note}
            className={`flex-1 py-4 font-medium transition-colors ${
              note.trim() || shiftDay.notes !== note
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Guardar Nota
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;