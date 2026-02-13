import React, { useState, useEffect } from 'react';
import CalendarView from '../components/CalendarView';
import NoteModal from '../components/NoteModal';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage } from '../utils/storage';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [noteModalDay, setNoteModalDay] = useState<ShiftDay | null>(null);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [selectedPaintShift, setSelectedPaintShift] = useState<ShiftType>(ShiftType.WORK);

  // Cargar datos
  useEffect(() => {
    const savedShifts = loadShiftsFromStorage();
    setShiftDays(savedShifts);
  }, []);

  // Guardar datos
  useEffect(() => {
    if (shiftDays.length > 0) {
      saveShiftsToStorage(shiftDays);
    }
  }, [shiftDays]);

  // Cambiar turno (modo pintura o normal)
  const handleDayClick = (day: ShiftDay) => {
    if (isPaintMode) {
      // En modo pintura, aplicar el turno seleccionado
      const updatedDay = { ...day, shiftType: selectedPaintShift };
      updateDay(updatedDay);
    } else {
      // En modo normal, abrir modal de notas
      setNoteModalDay(day);
    }
  };

  // Abrir modal de notas
  const handleNoteClick = (day: ShiftDay) => {
    setNoteModalDay(day);
  };

  // Actualizar un día específico
  const updateDay = (updatedDay: ShiftDay) => {
    const updatedDays = shiftDays.filter(d => 
      d.date.toDateString() !== updatedDay.date.toDateString()
    );
    updatedDays.push(updatedDay);
    setShiftDays(updatedDays);
  };

  // Guardar nota
  const handleSaveNote = (note: string) => {
    if (!noteModalDay) return;
    
    const updatedDay = { ...noteModalDay, notes: note };
    updateDay(updatedDay);
    setNoteModalDay(null);
  };

  // Toggle modo pintura
  const togglePaintMode = () => {
    setIsPaintMode(!isPaintMode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="bg-gradient-to-r from-red-600 to-black py-4 text-center">
        <h1 className="text-4xl font-black text-white">USIR</h1>
      </div>

      {/* Calendario */}
      <div className="h-[calc(100vh-80px)]">
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          shiftDays={shiftDays}
          onDayClick={handleDayClick}
          onNoteClick={handleNoteClick}
          isPaintMode={isPaintMode}
        />

        {/* Barra inferior simple */}
        <div className="bg-white border-t border-gray-200 py-3 px-4">
          <button
            onClick={togglePaintMode}
            className={`w-full py-2 rounded-lg font-medium ${
              isPaintMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isPaintMode ? 'Modo Pintura Activado' : 'Activar Modo Pintura'}
          </button>
        </div>
      </div>

      {/* Modal de notas */}
      {noteModalDay && (
        <NoteModal
          date={noteModalDay.date}
          initialNote={noteModalDay.notes || ''}
          onSave={handleSaveNote}
          onClose={() => setNoteModalDay(null)}
        />
      )}
    </div>
  );
};

export default Index;