import { AceStreamLink } from "@/lib/types";

interface ResultsDisplayProps {
  results: AceStreamLink[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results.length) return null;

  return (
    <div className="results-container mb-6">
      <h2 className="text-lg font-medium mb-2 text-gray-800 flex items-center justify-between">
        <span>Extracted Data</span>
        <span className="text-sm font-normal text-gray-500">{results.length} items found</span>
      </h2>
      
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 grid grid-cols-12 text-sm font-medium text-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Channel Name</div>
          <div className="col-span-4">AceStream ID</div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="grid grid-cols-12 px-4 py-2 border-b border-gray-100 text-sm hover:bg-gray-50">
              <div className="col-span-1 text-gray-500">{index + 1}</div>
              <div className="col-span-7 font-medium text-gray-800">{result.name}</div>
              <div 
                className="col-span-4 font-mono text-xs bg-gray-100 p-1 rounded overflow-hidden text-gray-700 truncate" 
                title={result.aceStreamId}
              >
                {result.aceStreamId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
