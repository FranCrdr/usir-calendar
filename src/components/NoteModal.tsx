import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NoteModalProps {
  date: Date;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ date, initialNote, onSave, onClose }) => {
  const [note, setNote] = useState(initialNote || '');

  const handleSave = () => {
    onSave(note);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Nota para {date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escribe tu nota aquí... (se mostrará completa en el día del calendario)"
            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
            autoFocus
          />
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Guardar Nota
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;