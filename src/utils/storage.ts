import { ShiftDay } from '../types/ShiftTypes';

const SHIFTS_STORAGE_KEY = 'shift_calendar_data';
const PATTERNS_STORAGE_KEY = 'shift_patterns_data';

export const saveShiftsToStorage = (shiftDays: ShiftDay[]): void => {
  try {
    const serialized = JSON.stringify(shiftDays.map(day => ({
      ...day,
      date: day.date.toISOString()
    })));
    localStorage.setItem(SHIFTS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving shifts:', error);
  }
};

export const loadShiftsFromStorage = (): ShiftDay[] => {
  try {
    const stored = localStorage.getItem(SHIFTS_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((day: any) => ({
      ...day,
      date: new Date(day.date)
    }));
  } catch (error) {
    console.error('Error loading shifts:', error);
    return [];
  }
};

export const savePatternsToStorage = (patterns: any[]): void => {
  try {
    localStorage.setItem(PATTERNS_STORAGE_KEY, JSON.stringify(patterns));
  } catch (error) {
    console.error('Error saving patterns:', error);
  }
};

export const loadPatternsFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(PATTERNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading patterns:', error);
    return [];
  }
};