import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import ShiftEditor from '../components/ShiftEditor';
import NoteModal from '../components/NoteModal';
import PaintModeView from '../components/PaintModeView';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage } from '../utils/storage';
import { usePWA } from '../hooks/usePWA';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [shiftEditorDay, setShiftEditorDay] = useState<ShiftDay | null>(null);
  const [noteModalDay, setNoteModalDay] = useState<ShiftDay | null>(null);
  const [paintModeViewOpen, setPaintModeViewOpen] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [selectedPaintShift, setSelectedPaintShift] = useState<ShiftType>(ShiftType.FREE);

  const { isInstallable, installApp } = usePWA();

  // Cargar datos al iniciar
  useEffect(() => {
    const savedShifts = loadShiftsFromStorage();
    setShiftDays(savedShifts);
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    if (shiftDays.length > 0) {
      saveShiftsToStorage(shiftDays);
    }
  }, [shiftDays]);

  // Manejar clic en día del calendario
  const handleDayClick = (day: ShiftDay) => {
    if (isPaintMode) {
      // En modo pintura, aplicar el turno seleccionado
      const updatedDay = { ...day, shiftType: selectedPaintShift };
      updateDay(updatedDay);
    } else {
      // En modo normal, abrir editor de turno completo
      setShiftEditorDay(day);
    }
  };

  // Manejar clic en nota
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

  // Guardar cambios del editor
  const handleSaveShift = (day: ShiftDay) => {
    updateDay(day);
    setShiftEditorDay(null);
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
    if (!isPaintMode) {
      setPaintModeViewOpen(true);
    } else {
      setIsPaintMode(false);
    }
  };

  // Seleccionar turno en modo pintura
  const handleSelectPaintShift = (shiftType: ShiftType) => {
    setSelectedPaintShift(shiftType);
    setIsPaintMode(true);
    setPaintModeViewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-black py-6 px-4 text-center relative">
        <h1 className="text-4xl font-black text-white mb-2">USIR</h1>
        <p className="text-white/90 text-sm">CALENDARIO DE TURNOS</p>
        
        {/* Botón de instalación PWA */}
        {isInstallable && (
          <button
            onClick={installApp}
            className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            Instalar App
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {shiftDays.filter(d => d.shiftType !== ShiftType.FREE).length} días trabajados
          </span>
          <span className="text-gray-600">
            {shiftDays.filter(d => d.shiftType === ShiftType.FREE).length} días libres
          </span>
        </div>
      </div>

      {/* Calendario */}
      <div className="flex-1 overflow-hidden">
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          shiftDays={shiftDays}
          onDayClick={handleDayClick}
          onNoteClick={handleNoteClick}
          isPaintMode={isPaintMode}
        />
      </div>

      {/* Barra de acciones inferior - simplificada */}
      <div className="bg-white border-t border-gray-200 py-3 px-4">
        <div className="flex justify-center items-center">
          {/* Botón Modo Pintura */}
          <button
            onClick={togglePaintMode}
            className={`flex flex-col items-center ${
              isPaintMode 
                ? 'text-blue-600 scale-110' 
                : 'text-gray-600 hover:text-purple-600'
            } transition-all`}
            title="Modo Pintura"
          >
            <Palette className="w-6 h-6 mb-1" />
            <span className="text-xs">Pintar</span>
          </button>

          {/* Indicador modo pintura activo */}
          {isPaintMode && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Modo Pintura: {selectedPaintShift}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {shiftEditorDay && (
        <ShiftEditor
          shiftDay={shiftEditorDay}
          onSave={handleSaveShift}
          onClose={() => setShiftEditorDay(null)}
        />
      )}

      {noteModalDay && (
        <NoteModal
          date={noteModalDay.date}
          initialNote={noteModalDay.notes || ''}
          onSave={handleSaveNote}
          onClose={() => setNoteModalDay(null)}
        />
      )}

      {paintModeViewOpen && (
        <PaintModeView
          selectedShift={selectedPaintShift}
          onSelectShift={handleSelectPaintShift}
          onClose={() => setPaintModeViewOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;