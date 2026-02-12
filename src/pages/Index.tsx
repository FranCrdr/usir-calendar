import React, { useState, useEffect } from 'react';
import CalendarView from '../components/CalendarView';
import ShiftEditor from '../components/ShiftEditor';
import PaintModeView from '../components/PaintModeView';
import TurnosView from '../components/TurnosView';
import SettingsView from '../components/SettingsView';
import { ShiftType, ShiftDay } from '../types/ShiftTypes';
import { saveShiftsToStorage, loadShiftsFromStorage } from '../utils/storage';
import { showSuccess } from '../utils/toast';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<ShiftDay | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [isTurnosMode, setIsTurnosMode] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [selectedPaintShift, setSelectedPaintShift] = useState<ShiftType>(ShiftType.MORNING);

  useEffect(() => {
    // Load saved shifts on app start
    const savedShifts = loadShiftsFromStorage();
    setShiftDays(savedShifts);
  }, []);

  const handleDayTap = (day: ShiftDay) => {
    if (isPaintMode) {
      // Paint mode: apply selected shift directly
      const updatedDays = shiftDays.map(d => 
        d.date.toDateString() === day.date.toDateString() 
          ? { ...d, shiftType: selectedPaintShift }
          : d
      );
      setShiftDays(updatedDays);
      saveShiftsToStorage(updatedDays);
      return;
    }

    // Normal mode: open editor
    setSelectedDay(day);
    setIsEditMode(true);
  };

  const handleDayLongPress = (day: ShiftDay) => {
    setSelectedDay(day);
    setIsEditMode(true);
  };

  const updateShiftDay = (updatedDay: ShiftDay) => {
    const updatedDays = shiftDays.map(d => 
      d.date.toDateString() === updatedDay.date.toDateString() ? updatedDay : d
    );
    setShiftDays(updatedDays);
    saveShiftsToStorage(updatedDays);
    setIsEditMode(false);
    setSelectedDay(null);
    showSuccess('Turno actualizado');
  };

  const togglePaintMode = () => {
    setIsPaintMode(!isPaintMode);
    setIsTurnosMode(false);
    setIsSettingsMode(false);
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

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      {/* Status Bar Spacer */}
      <div className="h-[44px] bg-white"></div>
      
      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-44px)]">
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          shiftDays={shiftDays}
          onDayTap={handleDayTap}
          onDayLongPress={handleDayLongPress}
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