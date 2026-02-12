import React from 'react';
import { X, Download, Share2, FileText, Calendar, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';

interface SettingsViewProps {
  shiftDays: any[];
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ shiftDays, onClose }) => {
  const exportAsPDF = () => {
    showSuccess('Función de exportación PDF en desarrollo');
    // PDF export functionality would go here
  };

  const exportAsICS = () => {
    showSuccess('Función de exportación iCal en desarrollo');
    // iCal export functionality would go here
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

  const shareAsImage = () => {
    showSuccess('Función de compartir imagen en desarrollo');
    // Image share functionality would go here
  };

  const clearAllData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('shift_calendar_data');
      localStorage.removeItem('shift_patterns_data');
      window.location.reload();
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
          <div className="space-y-4">
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
                  onClick={shareAsImage}
                  className="p-3 border border-gray-200 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-sm">Imagen</span>
                </button>
              </div>
            </section>

            <section>
              <h3 className="font-medium text-gray-900 mb-3">Gestión de Datos</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <p>Turnos guardados: {shiftDays.length}</p>
                  <p>Última actualización: {new Date().toLocaleDateString()}</p>
                </div>
                
                <button
                  onClick={clearAllData}
                  className="w-full p-3 border border-red-200 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Borrar Todos los Datos
                </button>
              </div>
            </section>

            <section>
              <h3 className="font-medium text-gray-900 mb-3">Información</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Versión: 1.0.0</p>
                <p>Desarrollado con React & TypeScript</p>
                <p>Optimizado para iPhone 15 Pro Max</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;