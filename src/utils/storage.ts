import { ShiftDay } from '../types/ShiftTypes';

const SHIFTS_STORAGE_KEY = 'shift_calendar_data_v2';
const SETTINGS_STORAGE_KEY = 'shift_settings_data_v2';

// Mejorar el manejo de errores y versionado
export const saveShiftsToStorage = (shiftDays: ShiftDay[]): void => {
  try {
    const dataToSave = {
      version: '2.0',
      lastSaved: new Date().toISOString(),
      data: shiftDays.map(day => ({
        ...day,
        date: day.date.toISOString()
      }))
    };
    
    localStorage.setItem(SHIFTS_STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Datos guardados exitosamente:', shiftDays.length, 'turnos');
  } catch (error) {
    console.error('Error guardando turnos:', error);
    // Fallback: intentar guardar sin metadata si hay problemas de espacio
    try {
      const serialized = JSON.stringify(shiftDays.map(day => ({
        ...day,
        date: day.date.toISOString()
      })));
      localStorage.setItem(SHIFTS_STORAGE_KEY, serialized);
    } catch (fallbackError) {
      console.error('Error en fallback al guardar:', fallbackError);
    }
  }
};

export const loadShiftsFromStorage = (): ShiftDay[] => {
  try {
    const stored = localStorage.getItem(SHIFTS_STORAGE_KEY);
    if (!stored) {
      console.log('No se encontraron datos guardados, iniciando con array vacío');
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    // Manejar tanto la versión nueva como la antigua
    let shiftData;
    if (parsed.data && parsed.version) {
      // Nueva versión con metadata
      shiftData = parsed.data;
    } else {
      // Versión antigua sin metadata
      shiftData = parsed;
    }
    
    const result = shiftData.map((day: any) => ({
      ...day,
      date: new Date(day.date)
    }));
    
    console.log('Datos cargados exitosamente:', result.length, 'turnos');
    return result;
  } catch (error) {
    console.error('Error cargando turnos:', error);
    // Limpiar datos corruptos
    localStorage.removeItem(SHIFTS_STORAGE_KEY);
    return [];
  }
};

// Guardar configuración de usuario
export const saveUserSettings = (settings: any): void => {
  try {
    const dataToSave = {
      version: '2.0',
      lastSaved: new Date().toISOString(),
      data: settings
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error guardando configuración:', error);
  }
};

export const loadUserSettings = (): any => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    return parsed.data && parsed.version ? parsed.data : parsed;
  } catch (error) {
    console.error('Error cargando configuración:', error);
    return {};
  }
};

// Verificar espacio disponible en localStorage
export const checkStorageSpace = (): { used: number; available: number; percentage: number } => {
  try {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Estimación aproximada (5MB es el límite típico)
    const available = 5 * 1024 * 1024 - used;
    const percentage = (used / (5 * 1024 * 1024)) * 100;
    
    return { used, available, percentage };
  } catch (error) {
    console.error('Error verificando espacio:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
};