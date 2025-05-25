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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [noNewEra, setNoNewEra] = useState(true); // Nuevo estado para el checkbox

  // Extract unique company names from the results
  const companyNames = useMemo(() => {
    const companies = new Set<string>();
    const commonPrefixes = [
      "MOVISTAR+", "MOVISTAR", "DAZN", "ESPN", "FOX", 
      "BEIN", "SKY", "HBO", "SPORT", "EUROSPORT", "CNN",
      "BBC", "ITV", "PREMIER", "LIGA", "SERIE",
      "UFC", "F1", "NBA", "TENNIS",
    ];

    results.forEach(result => {
      const name = result.name.split('-->')[0].trim();
      let companyName = "";

      for (const prefix of commonPrefixes) {
        if (name.toUpperCase().includes(prefix)) {
          companyName = prefix;
          break;
        }
      }

      if (companyName) {
        companies.add(companyName);
      }

      /*
      // --- Lógica anterior para extraer nombres más detallados ---
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
      // --- Fin lógica anterior ---
      */
    });

    return Array.from(companies).sort();
  }, [results]);

  
  
  // Filter results based on selected companies and "no new era"
  const filteredResults = useMemo(() => {
    let filtered = results;

    if (selectedCompanies.length) {
      filtered = filtered.filter(result =>
        selectedCompanies.some(company =>
          result.name.toUpperCase().includes(company.toUpperCase())
        )
      );
    }

    if (noNewEra) {
      filtered = filtered.filter(result =>
        !result.name.trim().toUpperCase().endsWith('--> NEW ERA')
      );
    }

    return filtered;
  }, [results, selectedCompanies, noNewEra]);
  
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

  // Copiar AceStream ID al portapapeles
  const handleCopy = (aceStreamId: string, index: number) => {
    navigator.clipboard.writeText(aceStreamId);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
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
          {/* Checkbox "no new era" */}
          <div className="mt-4 flex items-center">
            <input
              id="no-new-era"
              type="checkbox"
              checked={noNewEra}
              onChange={e => setNoNewEra(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="no-new-era" className="text-xs text-gray-700 cursor-pointer">
              NO NEW ERA
            </label>
          </div>
        </div>
      )}
      
      {/* Results table */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 grid grid-cols-12 text-sm font-medium text-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-11">Canal</div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {filteredResults.map((result, index) => (
            <div key={index} className="grid grid-cols-12 px-4 py-2 border-b border-gray-100 text-sm hover:bg-gray-50">
              <div className="col-span-1 text-gray-500">{index + 1}</div>
              <div
                className="col-span-11 font-medium text-gray-800 cursor-pointer relative select-none"
                title="Haz click para copiar el AceStream ID"
                onClick={() => handleCopy(result.aceStreamId, index)}
              >
                {result.name}
                {copiedIndex === index && (
                  <span className="absolute left-2/3 top-1/2 -translate-y-1/2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded ml-2 shadow">
                    Copiado!
                  </span>
                )}
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
