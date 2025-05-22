import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { scrapeRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Scrape the acestream links from a given URL
  app.post("/api/scrape", async (req, res) => {
    try {
      const { url } = scrapeRequestSchema.parse(req.body);
      
      // Fetch the HTML content from the provided URL with browser-like headers
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      });
      const htmlContent = response.data;
      
      // Extract the linksData variable from the HTML
      const linksDataRegex = /const\s+linksData\s+=\s+({[\s\S]*?});/;
      const linksDataMatch = htmlContent.match(linksDataRegex);
      
      if (!linksDataMatch || !linksDataMatch[1]) {
        return res.status(404).json({ 
          message: "Could not find linksData variable in the page source" 
        });
      }
      
      // Parse the JavaScript object into a JSON object
      let linksDataStr = linksDataMatch[1];
      // Clean up any JS-specific syntax that isn't valid JSON
      linksDataStr = linksDataStr.replace(/'/g, '"'); // Replace single quotes with double quotes
      
      let linksData;
      try {
        linksData = JSON.parse(linksDataStr);
      } catch (e) {
        // If parsing fails, try to evaluate it using a function
        // This is safer than using eval directly
        try {
          const sandboxFn = new Function(`return ${linksDataStr}`);
          linksData = sandboxFn();
        } catch (e) {
          return res.status(500).json({ 
            message: "Failed to parse linksData from the page source",
            error: e instanceof Error ? e.message : String(e)
          });
        }
      }
      
      if (!linksData || !Array.isArray(linksData.links)) {
        return res.status(500).json({ 
          message: "Invalid linksData format, expected an object with a links array" 
        });
      }
      
      // Extract the name and ID from each link
      const aceStreamLinks = linksData.links.map((link: any) => {
        // Extract the acestream ID from the URL
        const aceStreamUrlRegex = /acestream:\/\/([a-f0-9]+)/i;
        const aceStreamMatch = link.url.match(aceStreamUrlRegex);
        
        if (!aceStreamMatch || !aceStreamMatch[1]) {
          return null;
        }
        
        return {
          name: link.name,
          aceStreamId: aceStreamMatch[1]
        };
      }).filter(Boolean);
      
      return res.json({ links: aceStreamLinks });
    } catch (e) {
      console.error("Error during scraping:", e);
      return res.status(500).json({ 
        message: "An error occurred while scraping the data",
        error: e instanceof Error ? e.message : String(e)
      });
    }
  });
  
  // Generate SXPF format from the provided links
  app.post("/api/generate-sxpf", async (req, res) => {
    try {
      const schema = z.object({
        links: z.array(z.object({
          name: z.string(),
          aceStreamId: z.string()
        }))
      });
      
      const { links } = schema.parse(req.body);
      
      // Create the SXPF XML format
      const sxpfContent = generateSxpfContent(links);
      
      return res.json({ sxpfContent });
    } catch (e) {
      console.error("Error generating SXPF format:", e);
      return res.status(500).json({ 
        message: "An error occurred while generating the SXPF format",
        error: e instanceof Error ? e.message : String(e)
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate SXPF XML content
function generateSxpfContent(links: { name: string, aceStreamId: string }[]) {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1">\n';
  xml += '      <title>Lista de reproducción</title>\n';
  xml += '      <trackList>\n';
  
  // Add each channel as a track
  links.forEach((link, index) => {
    xml += '            <track>\n';
    xml += `                    <location>acestream://${link.aceStreamId}</location>\n`;
    xml += `                    <title>${escapeXml(link.name)}</title>\n`;
    xml += '                    <extension application="http://www.videolan.org/vlc/playlist/0">\n';
    xml += `                            <vlc:id>${index}</vlc:id>\n`;
    xml += '                            <vlc:option>network-caching=1000</vlc:option>\n';
    xml += '                    </extension>\n';
    xml += '            </track>\n';
  });
  
  // Close tracklist
  xml += '      </trackList>\n';
  
  // Add VLC extension with item references
  xml += '      <extension application="http://www.videolan.org/vlc/playlist/0">\n';
  
  // Reference each track by its ID
  links.forEach((_, index) => {
    xml += `                    <vlc:item tid="${index}"/>\n`;
  });
  
  // Close extensions and playlist
  xml += '      </extension>\n';
  xml += '</playlist>';
  
  return xml;
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
