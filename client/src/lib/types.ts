export interface AceStreamLink {
  name: string;
  aceStreamId: string;
}

export interface ScrapeResponse {
  links: AceStreamLink[];
}

export interface GenerateXspfResponse {
  xspfContent: string;
}

export type ScrapeStatus = 'idle' | 'loading' | 'success' | 'error';
