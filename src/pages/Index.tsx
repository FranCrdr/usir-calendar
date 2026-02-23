"use client";

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

  useEffect(() => {
    const savedShifts = loadShiftsFromStorage();
    setShiftDays(savedShifts);
  }, []);

  useEffect(() => {
    if (shiftDays.length > 0) {
      saveShiftsToStorage(shiftDays);
    }
  }, [shiftDays]);

  const handleDayClick = (day: ShiftDay) => {
    if (isPaintMode) {
      const newShiftType = day.shiftType === selectedPaintShift 
        ? ShiftType.FREE 
        : selectedPaintShift;
        
      const updatedDay = { ...day, shiftType: newShiftType };
      updateDay(updatedDay);
    } else {
      setShiftEditorDay(day);
    }
  };

  const handleNoteClick = (day: ShiftDay) => {
    setNoteModalDay(day);
  };

  const updateDay = (updatedDay: ShiftDay) => {
    const updatedDays = shiftDays.filter(d => 
      d.date.toDateString() !== updatedDay.date.toDateString()
    );
    updatedDays.push(updatedDay);
    setShiftDays(updatedDays);
  };

  const handleSaveShift = (day: ShiftDay) => {
    updateDay(day);
    setShiftEditorDay(null);
  };

  const handleSaveNote = (note: string) => {
    if (!noteModalDay) return;
    
    const updatedDay = { ...noteModalDay, notes: note };
    updateDay(updatedDay);
    setNoteModalDay(null);
  };

  const togglePaintMode = () => {
    if (!isPaintMode) {
      setPaintModeViewOpen(true);
    } else {
      setIsPaintMode(false);
    }
  };

  const handleSelectPaintShift = (shiftType: ShiftType) => {
    setSelectedPaintShift(shiftType);
    setIsPaintMode(true);
    setPaintModeViewOpen(false);
  };

  return (
    <div className="h-screen w-full bg-[#050508] flex flex-col relative overflow-hidden p-3 sm:p-4">
      {/* Fondo Espacial con Gradientes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-red-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Header Redondeado - Restaurado el rojo brillante sin defectos */}
      <div className="bg-red-600 py-4 px-4 text-center relative z-10 shadow-lg rounded-3xl mb-3 sm:mb-4 border border-white/20 overflow-hidden">
        {/* Capa de profundidad para evitar la línea vertical */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-transparent to-black/40 pointer-events-none" />
        
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tighter relative z-10 drop-shadow-md">USIR</h1>
        <p className="text-white/90 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase relative z-10">Calendario de Turnos</p>
        
        {isInstallable && (
          <button
            onClick={installApp}
            className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-[10px] font-medium hover:bg-white/30 transition-colors z-20"
          >
            Instalar
          </button>
        )}
      </div>

      {/* Calendario Flexible */}
      <div className="flex-1 relative z-10 overflow-hidden mb-3 sm:mb-4">
        <div className="h-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <CalendarView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            shiftDays={shiftDays}
            onDayClick={handleDayClick}
            onNoteClick={handleNoteClick}
            isPaintMode={isPaintMode}
          />
        </div>
      </div>

      {/* Barra de acciones inferior */}
      <div className="relative z-10 bg-black/40 backdrop-blur-2xl border border-white/10 py-3 px-4 rounded-3xl max-w-4xl mx-auto w-full">
        <div className="flex justify-center items-center">
          <button
            onClick={togglePaintMode}
            className={`flex flex-col items-center group transition-all duration-300 ${
              isPaintMode 
                ? 'text-blue-400 scale-110' 
                : 'text-gray-400 hover:text-white'
            }`}
            title="Modo Pintura"
          >
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isPaintMode ? 'bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-white/5 group-hover:bg-white/10'}`}>
              <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] mt-1 font-bold uppercase tracking-widest">Pintar</span>
          </button>

          {isPaintMode && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-bounce whitespace-nowrap">
              MODO PINTURA: {selectedPaintShift}
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