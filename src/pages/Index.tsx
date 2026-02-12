import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import ShiftEditor from '../components/ShiftEditor';
import PaintModeView from '../components/PaintModeView';
import TurnosView from '../components/TurnosView';
import SettingsView from '../components/SettingsView';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage, checkStorageSpace } from '../utils/storage';
import { showSuccess, showError } from '../utils/toast';
import { usePWA } from '../hooks/usePWA';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<ShiftDay | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [isTurnosMode, setIsTurnosMode] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [selectedPaintShift, setSelectedPaintShift] = useState<ShiftType>(ShiftType.WORK);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { isInstallable, installApp } = usePWA();

  // Manejar cambios de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess('Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showSuccess('Modo offline activado - La app sigue funcionando');
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
          showError('Espacio de almacenamiento casi lleno. Considera exportar y limpiar datos.');
        }
        
        // Cargar turnos guardados
        const savedShifts = loadShiftsFromStorage();
        console.log('Datos cargados:', savedShifts.length, 'turnos');
        
        setShiftDays(savedShifts);
        
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        showError('Error al cargar los datos guardados');
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
    console.log('Día actualizado:', day.date.toDateString());
    
    // Si estamos en modo pintar, usar la funcionalidad original
    if (isPaintMode) {
      const updatedDays = shiftDays.map(d => 
        d.date.toDateString() === day.date.toDateString() 
          ? { ...d, shiftType: selectedPaintShift }
          : d
      );
      
      setShiftDays(updatedDays);
      showSuccess(`Turno ${selectedPaintShift} aplicado al día ${day.date.getDate()}`);
      return;
    }

    // Si recibimos un día actualizado (desde el selector), actualizar la lista
    const updatedDays = shiftDays.map(d => 
      d.date.toDateString() === day.date.toDateString() ? day : d
    );
    
    setShiftDays(updatedDays);
    showSuccess(`Turno ${day.shiftType} asignado al día ${day.date.getDate()}`);
  };

  const handleDayLongPress = (day: ShiftDay) => {
    console.log('Largo press en día:', day.date.toDateString());
    setSelectedDay(day);
    setIsEditMode(true);
  };

  const updateShiftDay = (updatedDay: ShiftDay) => {
    const updatedDays = shiftDays.map(d => 
      d.date.toDateString() === updatedDay.date.toDateString() ? updatedDay : d
    );
    
    setShiftDays(updatedDays);
    setIsEditMode(false);
    showSuccess(`Turno actualizado para el ${updatedDay.date.toLocaleDateString()}`);
  };

  const togglePaintMode = () => {
    setIsPaintMode(!isPaintMode);
    setIsTurnosMode(false);
    setIsSettingsMode(false);
    
    if (!isPaintMode) {
      showSuccess('Modo pintar activado - Selecciona un turno y toca días');
    }
  };

  const toggleTurnosMode = () => {
    setIsTurnosMode(!isTurnosMode);
    setIsPaintMode(false);
    setIsSettingsMode(false);
  };

  const toggleSettingsMode = () => {
    setIsSettingsMode(!isSettingsMode);
    setIsPaintMode(false);
    setIsTurnosMode(false);
  };

  // Manejar cierre/refresh de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Guardar datos antes de cerrar/refrescar
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
      <div className="h-[44px] bg-white">
        {/* Indicador de conexión */}
        {!isOnline && (
          <div className="bg-yellow-500 text-white text-xs text-center py-1">
            🔄 Modo offline - Funcionando sin conexión
          </div>
        )}
        
        {/* Promp de instalación PWA */}
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
      
      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-44px)]">
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          shiftDays={shiftDays}
          onDayTap={handleDayTap}
          onLongPress={handleDayLongPress}
          isPaintMode={isPaintMode}
        />

        {/* Bottom Toolbar */}
        <div className="bg-white border-t border-gray-200 py-3 px-4 safe-area-inset-bottom">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button
              onClick={togglePaintMode}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                isPaintMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
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

      {isPaintMode && (
        <PaintModeView
          selectedShift={selectedPaintShift}
          onSelectShift={setSelectedPaintShift}
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