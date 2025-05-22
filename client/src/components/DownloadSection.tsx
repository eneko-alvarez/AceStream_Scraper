import { Download } from "lucide-react";

interface DownloadSectionProps {
  isReadyToDownload: boolean;
  onDownload: () => void;
}

export function DownloadSection({ isReadyToDownload, onDownload }: DownloadSectionProps) {
  if (!isReadyToDownload) return null;

  return (
    <div className="download-section border-t border-gray-200 pt-5 mt-6">
      <h2 className="text-lg font-medium mb-3 text-gray-800">Download Processed Data</h2>
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
    </div>
  );
}
