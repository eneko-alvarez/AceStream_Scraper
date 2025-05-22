import { useState, useMemo } from "react";
import { AceStreamLink } from "@/lib/types";
import { Check, Filter } from "lucide-react";

interface ResultsDisplayProps {
  results: AceStreamLink[];
  selectedCompanies: string[];
  setSelectedCompanies: (companies: string[]) => void;
}

export function ResultsDisplay({ results, selectedCompanies, setSelectedCompanies }: ResultsDisplayProps) {
  if (!results.length) return null;
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique company names from the results
  const companyNames = useMemo(() => {
    const companies = new Set<string>();
    
    results.forEach(result => {
      // Extract company name - usually before words like "HD", "FHD", "SD", etc.
      const name = result.name.split('-->')[0].trim(); // Remove anything after arrow
      const parts = name.split(' ');
      
      // Try to extract company name by looking at the first few words
      // This is a simplified approach - might need refinement based on actual data
      const possibleCompanyWords = parts.slice(0, Math.min(3, parts.length));
      
      // Join first few words as the company name
      // For ESPN, DAZN, etc. it will capture just the company name
      // For "Movistar LaLiga" it will capture "Movistar LaLiga"
      let companyName = "";
      
      for (let i = 0; i < possibleCompanyWords.length; i++) {
        const word = possibleCompanyWords[i];
        // Skip common suffixes that aren't part of company name
        if (["HD", "FHD", "SD", "4K", "UHD"].includes(word)) continue;
        
        // Add word to company name
        companyName += (companyName ? " " : "") + word;
      }
      
      if (companyName) {
        companies.add(companyName);
      }
    });
    
    return Array.from(companies).sort();
  }, [results]);
  
  // Filter results based on selected companies
  const filteredResults = useMemo(() => {
    if (!selectedCompanies.length) return results; // Show all if none selected
    
    return results.filter(result => {
      return selectedCompanies.some(company => 
        result.name.toUpperCase().includes(company.toUpperCase())
      );
    });
  }, [results, selectedCompanies]);
  
  // Toggle company selection
  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };
  
  // Toggle all companies
  const toggleAllCompanies = () => {
    if (selectedCompanies.length === companyNames.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies([...companyNames]);
    }
  };

  return (
    <div className="results-container mb-6">
      <h2 className="text-lg font-medium mb-2 text-gray-800 flex items-center justify-between">
        <span>Extracted Data</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-normal text-gray-500">
            {filteredResults.length} of {results.length} items
          </span>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </button>
        </div>
      </h2>
      
      {/* Filter section */}
      {showFilters && (
        <div className="mb-4 border border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Filter by Company</h3>
            <button 
              onClick={toggleAllCompanies}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {selectedCompanies.length === companyNames.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {companyNames.map(company => (
              <button
                key={company}
                onClick={() => toggleCompany(company)}
                className={`text-xs px-2 py-1 rounded-md flex items-center ${
                  selectedCompanies.includes(company) 
                    ? "bg-blue-100 text-blue-800 border border-blue-300" 
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {selectedCompanies.includes(company) && (
                  <Check className="h-3 w-3 mr-1" />
                )}
                {company}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results table */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 grid grid-cols-12 text-sm font-medium text-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Channel Name</div>
          <div className="col-span-4">AceStream ID</div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {filteredResults.map((result, index) => (
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
          
          {filteredResults.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              No channels match the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
