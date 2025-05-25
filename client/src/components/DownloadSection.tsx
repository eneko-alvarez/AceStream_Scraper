import { Download, Filter } from "lucide-react";

interface DownloadSectionProps {
  isReadyToDownload: boolean;
  onDownload: () => void;
  hasResults: boolean;
  onGenerateXspf: () => void;
  selectedCompaniesCount: number;
  totalChannelsCount: number;
}

export function DownloadSection({ 
  isReadyToDownload, 
  onDownload, 
  hasResults, 
  onGenerateXspf,
  selectedCompaniesCount,
  totalChannelsCount
}: DownloadSectionProps) {
  // Show nothing if there are no results at all
  if (!hasResults) return null;

  return (
    <div className="download-section border-t border-gray-200 pt-5 mt-6">
      <h2 className="text-lg font-medium mb-3 text-gray-800">Export & Download</h2>
      
      {!isReadyToDownload ? (
        <>
          <p className="text-gray-600 mb-4">
            {selectedCompaniesCount > 0 ? (
              <>Has seleccionado <span className="font-medium">{selectedCompaniesCount}</span> plataforma.</>
            ) : (
              <>Todos los <span className="font-medium">{totalChannelsCount}</span> canales van a ser descargados.</>
            )} Usa el boton de filtrar si quieres cambiar esto antes de descargar la playlist.
          </p>
          
          <button 
            onClick={onGenerateXspf}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Generar Descarga
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            <br></br>
          </p>
          
          <button 
            onClick={onDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Descargar playlist
          </button>
        </>
      )}
    </div>
  );
}
