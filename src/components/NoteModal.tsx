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
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nota para {date.toLocaleDateString('es-ES')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tu nota aquí..."
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
          autoFocus
        />
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;