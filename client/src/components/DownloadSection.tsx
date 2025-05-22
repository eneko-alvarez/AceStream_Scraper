import { Download, Filter } from "lucide-react";

interface DownloadSectionProps {
  isReadyToDownload: boolean;
  onDownload: () => void;
  hasResults: boolean;
  onGenerateSxpf: () => void;
  selectedCompaniesCount: number;
  totalChannelsCount: number;
}

export function DownloadSection({ 
  isReadyToDownload, 
  onDownload, 
  hasResults, 
  onGenerateSxpf,
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
              <>You have selected channels from <span className="font-medium">{selectedCompaniesCount}</span> companies.</>
            ) : (
              <>All <span className="font-medium">{totalChannelsCount}</span> channels will be included in the export.</>
            )} Use the filter buttons above to customize your selection.
          </p>
          
          <button 
            onClick={onGenerateSxpf}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Generate .sxpf with Selected Channels
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Your data has been successfully processed and is ready to be downloaded as an .sxpf configuration file.
          </p>
          
          <button 
            onClick={onDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download .sxpf Configuration
          </button>
        </>
      )}
    </div>
  );
}
