import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import ShiftEditor from '../components/ShiftEditor';
import NoteModal from '../components/NoteModal';
import PaintModeView from '../components/PaintModeView';
import TurnosView from '../components/TurnosView';
import SettingsView from '../components/SettingsView';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage, checkStorageSpace } from '../utils/storage';
import { usePWA } from '../hooks/usePWA';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<ShiftDay | null>(null);
  const [dayForNote, setDayForNote] = useState<ShiftDay | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [isTurnosMode, setIsTurnosMode] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [selectedPaintShift, setSelectedPaintShift] = useState<ShiftType>(ShiftType.WORK);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPaintToolbar, setShowPaintToolbar] = useState(false);
  
  const { isInstallable, installApp } = usePWA();

  // Manejar cambios de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    const initializeApp = () => {
      try {
        setIsLoading(true);
        
        // Verificar espacio de almacenamiento
        const storageInfo = checkStorageSpace();
        if (storageInfo.percentage > 90) {
          console.warn('Espacio de almacenamiento casi lleno. Considera exportar y limpiar datos.');
        }
        
        // Cargar turnos guardados
        const savedShifts = loadShiftsFromStorage();
        console.log('Datos cargados:', savedShifts.length, 'turnos');
        
        setShiftDays(savedShifts);
        
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Guardar automáticamente cuando cambien los turnos
  useEffect(() => {
    if (!isLoading && shiftDays.length > 0) {
      const timer = setTimeout(() => {
        console.log('Guardando cambios...', shiftDays.length, 'turnos');
        saveShiftsToStorage(shiftDays);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [shiftDays, isLoading]);

  const handleDayTap = (day: ShiftDay) => {
    console.log('Día actualizado:', day.date.toDateString(), 'Turno:', day.shiftType, 'Notas:', day.notes);
    
    // Crear una nueva lista actualizada de días
    const updatedDays = shiftDays.filter(d => 
      d.date.toDateString() !== day.date.toDateString()
    );
    
    // Agregar el día actualizado
    updatedDays.push(day);
    
    setShiftDays(updatedDays);
  };

  const handleDayLongPress = (day: ShiftDay) => {
    console.log('Largo press en día:', day.date.toDateString());
    setSelectedDay(day);
    setIsEditMode(true);
  };

  const handleDayNoteTap = (day: ShiftDay) => {
    console.log('Toque para anotación en día:', day.date.toDateString());
    setDayForNote(day);
    setIsNoteMode(true);
  };

  const updateShiftDay = (updatedDay: ShiftDay) => {
    const updatedDays = shiftDays.map(d => 
      d.date.toDateString() === updatedDay.date.toDateString() ? updatedDay : d
    );
    
    setShiftDays(updatedDays);
    setIsEditMode(false);
  };

  const updateNote = (note: string) => {
    if (!dayForNote) return;
    
    console.log('Actualizando nota para:', dayForNote.date.toDateString(), 'Nota:', note);
    
    const updatedDays = shiftDays.map(d => 
      d.date.toDateString() === dayForNote.date.toDateString() ? { ...d, notes: note } : d
    );
    
    setShiftDays(updatedDays);
    setIsNoteMode(false);
    setDayForNote(null);
  };

  const startPaintMode = () => {
    console.log('Iniciando modo pintar...');
    setIsPaintMode(true);
    setIsTurnosMode(false);
    setIsSettingsMode(false);
    setShowPaintToolbar(false);
  };

  const finishPaintMode = () => {
    console.log('Terminando modo pintar...');
    setIsPaintMode(false);
    setShowPaintToolbar(false);
  };

  const handlePaintShiftSelect = (shiftType: ShiftType) => {
    console.log('Seleccionado turno para pintar:', shiftType);
    setSelectedPaintShift(shiftType);
    setIsPaintMode(false);
    setShowPaintToolbar(true);
  };

  const paintDay = (day: ShiftDay) => {
    if (showPaintToolbar) {
      console.log('Pintando día:', day.date.toDateString(), 'con turno:', selectedPaintShift);
      
      const updatedDay = {
        ...day,
        shiftType: selectedPaintShift
      };
      
      handleDayTap(updatedDay);
    }
  };

  const toggleTurnosMode = () => {
    setIsTurnosMode(!isTurnosMode);
    setIsPaintMode(false);
    setIsSettingsMode(false);
    setShowPaintToolbar(false);
  };

  const toggleSettingsMode = () => {
    setIsSettingsMode(!isSettingsMode);
    setIsPaintMode(false);
    setIsTurnosMode(false);
    setShowPaintToolbar(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (shiftDays.length > 0) {
        saveShiftsToStorage(shiftDays);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shiftDays]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus turnos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      {/* Status Bar Spacer */}
      <div className="bg-white">
        {/* Título USIR arriba del todo */}
        <div className="bg-gradient-to-r from-red-600 to-black py-4">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-wider text-white">
              <span className="text-white">U</span>
              <span className="text-red-600">S</span>
              <span className="text-white">I</span>
              <span className="text-red-600">R</span>
            </h1>
          </div>
        </div>
        
        {!isOnline && (
          <div className="bg-yellow-500 text-white text-xs text-center py-1">
            🔄 Modo offline - Funcionando sin conexión
          </div>
        )}
        
        {isInstallable && (
          <div className="bg-blue-600 text-white text-xs text-center py-1 flex justify-center items-center">
            <span>📱 Instala la app para mejor experiencia</span>
            <button 
              onClick={installApp}
              className="ml-2 px-2 py-1 bg-white text-blue-600 rounded text-xs font-medium flex items-center"
            >
              <Download className="w-3 h-3 mr-1" />
              Instalar
            </button>
          </div>
        )}
      </div>
      
      {/* Barra de pintar activa */}
      {showPaintToolbar && (
        <div className="bg-blue-600 text-white py-2 px-4 text-center flex justify-between items-center">
          <span className="flex-1 text-sm font-medium">
            🎨 Pintando: {selectedPaintShift}
          </span>
          <button
            onClick={finishPaintMode}
            className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium"
          >
            Terminar (X)
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`flex flex-col ${showPaintToolbar ? 'h-[calc(100vh-80px-40px)]' : 'h-[calc(100vh-80px)]'}`}>
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          shiftDays={shiftDays}
          onDayTap={showPaintToolbar ? paintDay : handleDayTap}
          onLongPress={handleDayLongPress}
          onDayNoteTap={handleDayNoteTap}
          isPaintMode={showPaintToolbar}
        />

        {/* Bottom Toolbar */}
        <div className="bg-white border-t border-gray-200 py-3 px-4 safe-area-inset-bottom">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button
              onClick={startPaintMode}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                isPaintMode || showPaintToolbar ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg">🎨</span>
              <span className="text-xs font-medium mt-1">PINTAR</span>
            </button>
            
            <button
              onClick={toggleTurnosMode}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                isTurnosMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg">🔄</span>
              <span className="text-xs font-medium mt-1">TURNOS</span>
            </button>
            
            <button
              onClick={toggleSettingsMode}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                isSettingsMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg">⚙️</span>
              <span className="text-xs font-medium mt-1">AJUSTES</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlays */}
      {isEditMode && selectedDay && (
        <ShiftEditor
          shiftDay={selectedDay}
          onSave={updateShiftDay}
          onClose={() => setIsEditMode(false)}
        />
      )}

      {isNoteMode && dayForNote && (
        <NoteModal
          shiftDay={dayForNote}
          onSave={updateNote}
          onClose={() => setIsNoteMode(false)}
        />
      )}

      {isPaintMode && (
        <PaintModeView
          selectedShift={selectedPaintShift}
          onSelectShift={handlePaintShiftSelect}
          onClose={() => setIsPaintMode(false)}
        />
      )}

      {isTurnosMode && (
        <TurnosView
          shiftDays={shiftDays}
          setShiftDays={setShiftDays}
          onClose={() => setIsTurnosMode(false)}
        />
      )}

      {isSettingsMode && (
        <SettingsView
          shiftDays={shiftDays}
          onClose={() => setIsSettingsMode(false)}
        />
      )}
    </div>
  );
};

export default Index;