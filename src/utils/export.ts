import { ShiftDay } from '../types/ShiftTypes';

export const generateCalendarSummary = (shiftDays: ShiftDay[]): string => {
  const summary: string[] = [];
  
  // Resumen por mes/año
  const monthlyStats: { [key: string]: { [shift: string]: number } } = {};
  
  shiftDays.forEach(day => {
    const monthYear = `${day.date.getMonth() + 1}/${day.date.getFullYear()}`;
    if (!monthlyStats[monthYear]) {
      monthlyStats[monthYear] = {};
    }
    
    const shiftType = day.shiftType;
    monthlyStats[monthYear][shiftType] = (monthlyStats[monthYear][shiftType] || 0) + 1;
  });
  
  // Encabezado
  summary.push('📅 RESUMEN DE TURNOS');
  summary.push(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`);
  summary.push(`Total de días registrados: ${shiftDays.length}`);
  summary.push('');
  
  // Estadísticas por mes
  Object.keys(monthlyStats).sort().forEach(monthYear => {
    summary.push(`📊 ${monthYear}`);
    const shifts = monthlyStats[monthYear];
    
    Object.keys(shifts).forEach(shiftType => {
      const count = shifts[shiftType];
      const label = getShiftLabel(shiftType);
      summary.push(`  ${shiftType}: ${count} días ${label}`);
    });
    summary.push('');
  });
  
  // Detalles por día
  summary.push('📝 DETALLES DIARIOS');
  summary.push('');
  
  shiftDays.sort((a, b) => a.date.getTime() - b.date.getTime()).forEach(day => {
    const dateStr = day.date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const shiftLabel = getShiftLabel(day.shiftType);
    const notes = day.notes ? ` - ${day.notes}` : '';
    
    summary.push(`${dateStr}: ${day.shiftType} (${shiftLabel})${notes}`);
  });
  
  return summary.join('\n');
};

const getShiftLabel = (shiftType: string): string => {
  switch (shiftType) {
    case 'T': return 'Trabajo';
    case 'L': return 'Libre';
    case 'R': return 'Refuerzo';
    case 'A': return 'Alerta';
    case 'I': return 'Imaginaria';
    default: return '';
  }
};

export const exportAsTextFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};