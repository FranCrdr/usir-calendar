import React from 'react';
import { X, Download, Share2, FileText, Calendar, Trash2, Database, Smartphone, FileDown, Clipboard } from 'lucide-react';
import { saveShiftsToStorage, loadShiftsFromStorage, checkStorageSpace } from '../utils/storage';
import { generateCalendarSummary, exportAsTextFile } from '../utils/export';
import { showSuccess, showError } from '../utils/toast';

interface SettingsViewProps {
  shiftDays: any[];
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ shiftDays, onClose }) => {
  const storageInfo = checkStorageSpace();
  
  const exportAsPDF = () => {
    showSuccess('Función de exportación PDF en desarrollo');
  };

  const exportAsICS = () => {
    showSuccess('Función de exportación iCal en desarrollo');
  };

  const exportAsCSV = () => {
    try {
      const csvContent = shiftDays.map(day => 
        `${day.date.toISOString()},${day.shiftType},"${day.notes}"`
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `turnos-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      showSuccess('Calendario exportado como CSV');
    } catch (error) {
      showError('Error al exportar CSV');
    }
  };

  const exportAsTextSummary = () => {
    try {
      const summary = generateCalendarSummary(shiftDays);
      exportAsTextFile(summary, `resumen-turnos-${new Date().toISOString().split('T')[0]}.txt`);
      showSuccess('Resumen generado y descargado');
    } catch (error) {
      showError('Error generando resumen');
    }
  };

  const copyToClipboard = async () => {
    try {
      const summary = generateCalendarSummary(shiftDays);
      await navigator.clipboard.writeText(summary);
      showSuccess('Resumen copiado al portapapeles');
    } catch (error) {
      showError('Error copiando al portapapeles');
    }
  };

  const clearAllData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('shift_calendar_data_v2');
      localStorage.removeItem('shift_patterns_data_v2');
      localStorage.removeItem('shift_settings_data_v2');
      window.location.reload();
      showSuccess('Todos los datos han sido borrados');
    }
  };

  const backupData = () => {
    try {
      const backup = {
        shifts: shiftDays,
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-turnos-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showSuccess('Copia de seguridad creada');
    } catch (error) {
      showError('Error creando copia de seguridad');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Ajustes y Exportación</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Información de Almacenamiento */}
            <section>
              <div className="flex items-center mb-3">
                <Database className="w-4 h-4 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-900">Almacenamiento Local</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Turnos guardados:</span>
                  <span className="font-medium">{shiftDays.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Espacio usado:</span>
                  <span className="font-medium">
                    {(storageInfo.used / 1024).toFixed(1)} KB (
                    {storageInfo.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última modificación:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </section>

            {/* Exportar Datos */}
            <section>
              <h3 className="font-medium text-gray-900 mb-3">Exportar Datos</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={exportAsPDF}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-6 h-6 text-red-600 mb-1" />
                  <span className="text-sm">PDF</span>
                </button>
                
                <button
                  onClick={exportAsICS}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-sm">iCal</span>
                </button>
                
                <button
                  onClick={exportAsCSV}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-sm">CSV</span>
                </button>
                
                <button
                  onClick={exportAsTextSummary}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <FileDown className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-sm">Resumen</span>
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors col-span-2"
                >
                  <Clipboard className="w-6 h-6 text-orange-600 mb-1" />
                  <span className="text-sm">Copiar Resumen</span>
                </button>
              </div>
            </section>

            {/* Gestión de Datos */}
            <section>
              <h3 className="font-medium text-gray-900 mb-3">Gestión de Datos</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 mb-3">
                  <p>Todos los datos se guardan automáticamente en tu dispositivo.</p>
                </div>
                
                <button
                  onClick={backupData}
                  className="w-full p-3 border border-blue-200 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors mb-2"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Crear Copia de Seguridad
                </button>
                
                <button
                  onClick={clearAllData}
                  className="w-full p-3 border border-red-200 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Borrar Todos los Datos
                </button>
              </div>
            </section>

            {/* Información de la App */}
            <section>
              <div className="flex items-center mb-3">
                <Smartphone className="w-4 h-4 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Información</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Versión: 2.0.0</p>
                <p>Datos guardados localmente</p>
                <p>Compatible con iOS y Android</p>
                <p>¡Funciona completamente sin internet!</p>
                <p>Instálala como app para mejor experiencia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;