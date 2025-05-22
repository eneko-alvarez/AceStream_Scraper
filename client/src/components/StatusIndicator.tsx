import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { ScrapeStatus } from "@/lib/types";

interface StatusIndicatorProps {
  status: ScrapeStatus;
  loadingMessage: string;
  errorMessage: string;
}

export function StatusIndicator({ status, loadingMessage, errorMessage }: StatusIndicatorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2 text-gray-800">Current Status</h2>
      <div className="status-container">
        {/* Idle state */}
        {status === 'idle' && (
          <div className="bg-gray-50 rounded-md p-4 flex items-center">
            <span className="mr-3 text-gray-500">⏳</span>
            <span className="text-gray-600">Ready to start scraping process</span>
          </div>
        )}
        
        {/* Loading state */}
        {status === 'loading' && (
          <div className="bg-blue-50 rounded-md p-4 flex items-center">
            <RefreshCw className="h-5 w-5 mr-3 text-primary animate-spin" />
            <span className="text-primary-dark">{loadingMessage}</span>
          </div>
        )}
        
        {/* Success state */}
        {status === 'success' && (
          <div className="bg-green-50 rounded-md p-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
            <span className="text-green-800">Data successfully extracted and processed!</span>
          </div>
        )}
        
        {/* Error state */}
        {status === 'error' && (
          <div className="bg-red-50 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
            <div>
              <div className="text-red-800 font-medium">Error occurred during processing</div>
              <div className="text-red-700 mt-1 text-sm">{errorMessage}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
