export interface AceStreamLink {
  name: string;
  aceStreamId: string;
}

export interface ScrapeResponse {
  links: AceStreamLink[];
}

export interface GenerateSxpfResponse {
  sxpfContent: string;
}

export type ScrapeStatus = 'idle' | 'loading' | 'success' | 'error';
