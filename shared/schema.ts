import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main schema for AceStream links
export const aceStreamLinks = pgTable("acestream_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  aceStreamId: text("acestream_id").notNull().unique(),
});

// Schema for insert operations
export const insertAceStreamLinkSchema = createInsertSchema(aceStreamLinks).omit({
  id: true,
});

// Schema for the scrape request
export const scrapeRequestSchema = z.object({
  url: z.string().url(),
});

// Types
export type InsertAceStreamLink = z.infer<typeof insertAceStreamLinkSchema>;
export type AceStreamLink = typeof aceStreamLinks.$inferSelect;

// SXPF data structure
export type SxpfData = {
  links: AceStreamLink[];
};
