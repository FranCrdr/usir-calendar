import React, { useState, useEffect } from 'react';
import { Palette, Download, Upload, RotateCcw } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import ShiftEditor from '../components/ShiftEditor';
import NoteModal from '../components/NoteModal';
import PaintModeView from '../components/PaintModeView';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage } from '../utils/storage';
import { usePWA } from '../hooks/usePWA';
import { showSuccess, showError } from '../utils/toast';

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
      showSuccess('Modo pintura desactivado');
    }
  };

  // Seleccionar turno en modo pintura
  const handleSelectPaintShift = (shiftType: ShiftType) => {
    setSelectedPaintShift(shiftType);
    setIsPaintMode(true);
    setPaintModeViewOpen(false);
    showSuccess(`Modo pintura activado: ${shiftType}`);
  };

  // Resetear calendario completo
  const handleResetCalendar = () => {
    if (confirm('¿Estás seguro de que quieres resetear el calendario completo? Se perderán todos los datos.')) {
      setShiftDays([]);
      localStorage.removeItem('shift_calendar_data_v2');
      showSuccess('Calendario reseteado correctamente');
    }
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
            className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            Instalar App
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 font-medium">
            {shiftDays.filter(d => d.shiftType !== ShiftType.FREE).length} días trabajados
          </span>
          <span className="text-gray-600 font-medium">
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

      {/* Barra de acciones inferior mejorada */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg sticky bottom-0 z-10">
        <div className="flex justify-center items-center gap-6">
          {/* Botón Resetear Calendario */}
          <button
            onClick={handleResetCalendar}
            className="flex flex-col items-center group transition-transform hover:scale-110"
            title="Resetear Calendario"
          >
            <div className="bg-white p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <RotateCcw className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs text-white font-medium mt-1 opacity-90">Resetear</span>
          </button>

          {/* Botón Modo Pintura - Destacado */}
          <button
            onClick={togglePaintMode}
            className={`flex flex-col items-center group transition-all ${
              isPaintMode 
                ? 'scale-110 shadow-2xl' 
                : 'hover:scale-105'
            }`}
            title={isPaintMode ? 'Desactivar Modo Pintura' : 'Activar Modo Pintura'}
          >
            <div className={`p-3 rounded-full shadow-xl transition-all duration-300 ${
              isPaintMode 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-yellow-300 ring-opacity-60' 
                : 'bg-gradient-to-br from-white to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50'
            }`}>
              <Palette className={`w-7 h-7 transition-colors ${
                isPaintMode ? 'text-white' : 'text-purple-600 group-hover:text-blue-600'
              }`} />
            </div>
            <span className={`text-xs font-bold mt-1 transition-colors ${
              isPaintMode ? 'text-yellow-200' : 'text-white'
            }`}>
              {isPaintMode ? 'PINANDO!' : 'Pintar'}
            </span>
            
            {/* Indicador de turno seleccionado en modo pintura */}
            {isPaintMode && (
              <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-5 h-5 text-xs font-black flex items-center justify-center shadow-md">
                {selectedPaintShift}
              </div>
            )}
          </button>

          {/* Separador visual */}
          <div className="h-12 w-px bg-white/30 mx-2"></div>

          {/* Botones adicionales de utilidad */}
          <button
            onClick={() => showSuccess('Función en desarrollo')}
            className="flex flex-col items-center group transition-transform hover:scale-110"
            title="Exportar"
          >
            <div className="bg-white p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-white font-medium mt-1 opacity-90">Exportar</span>
          </button>

          <button
            onClick={() => showSuccess('Función en desarrollo')}
            className="flex flex-col items-center group transition-transform hover:scale-110"
            title="Importar"
          >
            <div className="bg-white p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-white font-medium mt-1 opacity-90">Importar</span>
          </button>
        </div>

        {/* Indicador modo pintura activo */}
        {isPaintMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            🎨 Modo Pintura Activado - Selecciona: {selectedPaintShift}
          </div>
        )}
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