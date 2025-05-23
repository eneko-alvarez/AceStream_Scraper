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
      
      // Try to identify common channel groups like M+ LALIGA, ESPN, DAZN, etc.
      // Removing numbers to group related channels together (e.g., M+ LALIGA and M+ LALIGA 2)
      
      // First try common channel prefixes
      const commonPrefixes = [
        "M+", "MOVISTAR+", "MOVISTAR", "DAZN", "ESPN", "FOX", 
        "BEIN", "SKY", "HBO", "SPORT", "EUROSPORT", "CNN",
        "BBC", "ITV", "CANAL", "PREMIER", "LIGA", "SERIE"
      ];
      
      let companyName = "";
      
      // Look for common prefixes
      for (const prefix of commonPrefixes) {
        if (name.toUpperCase().includes(prefix)) {
          // Find the prefix position
          const prefixPos = name.toUpperCase().indexOf(prefix);
          // Get text after prefix (excluding numbers)
          let afterPrefix = name.substring(prefixPos + prefix.length).trim();
          
          // Extract words until we hit a number or special suffix
          const afterParts = afterPrefix.split(' ');
          let extractedParts = [];
          
          for (const part of afterParts) {
            // Skip if it's a number or common suffix
            if (/^\d+$/.test(part) || ["HD", "FHD", "SD", "4K", "UHD"].includes(part.toUpperCase())) {
              continue;
            }
            extractedParts.push(part);
            // Stop after 2 words to keep company names concise
            if (extractedParts.length >= 2) break;
          }
          
          companyName = prefix + (extractedParts.length > 0 ? " " + extractedParts.join(" ") : "");
          break;
        }
      }
      
      // If no common prefix was found, use a more general approach
      if (!companyName) {
        const parts = name.split(' ');
        // Remove numbers and common suffixes
        const filteredParts = parts.filter(part => 
          !(/^\d+$/.test(part)) && 
          !["HD", "FHD", "SD", "4K", "UHD"].includes(part.toUpperCase())
        );
        
        // Take first 1-2 words as company name
        companyName = filteredParts.slice(0, Math.min(2, filteredParts.length)).join(" ");
      }
      
      if (companyName) {
        companies.add(companyName.trim());
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
        <span>Canales obtenidos</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-normal text-gray-500">
            {filteredResults.length} of {results.length} items selected
          </span>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            <Filter className="h-3 w-3 mr-1" />
            FILTRAR POR PLATAFORMA
          </button>
        </div>
      </h2>
      
      {/* Filter section */}
      {showFilters && (
        <div className="mb-4 border border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Selecciona los deseados</h3>
            <button 
              onClick={toggleAllCompanies}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {selectedCompanies.length === companyNames.length ? "Deselecciona todo" : "Selecciona todos"}
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
          <div className="col-span-7">Canal</div>
          {/* <div className="col-span-4">AceStream ID</div> */}
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {filteredResults.map((result, index) => (
            <div key={index} className="grid grid-cols-12 px-4 py-2 border-b border-gray-100 text-sm hover:bg-gray-50">
              <div className="col-span-1 text-gray-500">{index + 1}</div>
              <div className="col-span-7 font-medium text-gray-800">{result.name}</div>
              {/*<div 
                className="col-span-4 font-mono text-xs bg-gray-100 p-1 rounded overflow-hidden text-gray-700 truncate" 
                title={result.aceStreamId}
              >
                {result.aceStreamId}
              </div>*/}
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
