import { useState } from "react";
import { Code, Download, X } from "lucide-react";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { DownloadSection } from "@/components/DownloadSection";
import { AceStreamLink, ScrapeStatus } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>("idle");
  const [loadingMessage, setLoadingMessage] = useState("Obtaining IDs...");
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<AceStreamLink[]>([]);
  const [sxpfContent, setSxpfContent] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  
  const sourceUrl = "https://ipfs.io/ipns/k51qzi5uqu5di00365631hrj6m22vsjudpbtw8qpfw6g08gf3lsqdn6e89anq5/";
  
  // Mutation for scraping data
  const scrapeMutation = useMutation({
    mutationFn: async () => {
      setLoadingMessage("Scraping acestream links...");
      const response = await apiRequest("POST", "/api/scrape", { url: sourceUrl });
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.links);
      // Clear previous selections when new data arrives
      setSelectedCompanies([]);
      setScrapeStatus("success");
    },
    onError: (error) => {
      setScrapeStatus("error");
      setErrorMessage("Scraping failed: " + (error instanceof Error ? error.message : String(error)));
    }
  });
  
  const handleScrape = () => {
    setScrapeStatus("loading");
    setErrorMessage("");
    scrapeMutation.mutate();
  };
  
  const handleCancel = () => {
    scrapeMutation.reset();
    setScrapeStatus("idle");
  };
  
  const generateSxpf = async () => {
    // If no selected companies, use all results
    // Otherwise filter by selected companies
    const linksToUse = selectedCompanies.length === 0 
      ? results 
      : results.filter(result => 
          selectedCompanies.some(company => 
            result.name.toUpperCase().includes(company.toUpperCase())
          )
        );
    
    if (linksToUse.length === 0) {
      return;
    }
    
    try {
      setLoadingMessage("Generating SXPF format...");
      setScrapeStatus("loading");
      
      const sxpfResponse = await apiRequest("POST", "/api/generate-sxpf", { links: linksToUse });
      const sxpfData = await sxpfResponse.json();
      setSxpfContent(sxpfData.sxpfContent);
      setScrapeStatus("success");
    } catch (error) {
      setScrapeStatus("error");
      setErrorMessage("Failed to generate SXPF format: " + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  const handleDownload = () => {
    if (!sxpfContent) return;
    
    // Create a Blob with the SXPF content
    const blob = new Blob([sxpfContent], { type: "application/xml" });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "acestream_channels.sxpf";
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-gray-100 font-sans text-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Code className="h-6 w-6 mr-2 text-blue-600" />
            AceStream ID Scraper
          </h1>
          <p className="text-gray-600 mt-1">Extract channel names and IDs from AceStream links</p>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {/* Operation Details */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-gray-800">Operation Details</h2>
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <p className="mb-2">
                <span className="font-medium">Source URL:</span>{" "}
                <a 
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {sourceUrl}
                </a>
              </p>
              <p className="mb-2">
                <span className="font-medium">Target Variable:</span>{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">linksData</code>
              </p>
              <p>
                <span className="font-medium">Output Format:</span>{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">.sxpf</code> configuration file
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <StatusIndicator 
            status={scrapeStatus} 
            loadingMessage={loadingMessage} 
            errorMessage={errorMessage} 
          />
          
          {/* Action Buttons */}
          <div className="mb-6">
            {scrapeStatus !== "loading" ? (
              <button 
                onClick={handleScrape}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Start Scraping Process
              </button>
            ) : (
              <button 
                onClick={handleCancel}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel Operation
              </button>
            )}
          </div>
          
          {/* Results Display */}
          <ResultsDisplay 
            results={results} 
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
          />
          
          {/* Download Section */}
          <DownloadSection 
            isReadyToDownload={scrapeStatus === "success" && sxpfContent !== ""} 
            onDownload={handleDownload}
            hasResults={results.length > 0}
            onGenerateSxpf={generateSxpf}
            selectedCompaniesCount={selectedCompanies.length}
            totalChannelsCount={results.length}
          />
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 rounded-b-lg">
          <p>This tool extracts AceStream channel information and converts it to .sxpf format for easy configuration.</p>
        </div>
      </div>
    </div>
  );
}
