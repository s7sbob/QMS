/**
 * Pagination Types for SOP Document
 * Defines types for row-level pagination system
 */

import { ReactNode } from 'react';

/**
 * Represents a single row that can be paginated independently
 */
export interface PageableRow {
  /** Unique identifier for the row */
  id: string;
  /** Type of row for styling and layout purposes */
  type: 'section-header' | 'content-row' | 'section-divider';
  /** ID of the parent section this row belongs to */
  sectionId: string;
  /** The React content to render for this row */
  content: ReactNode;
  /** Optional pre-calculated height for optimization */
  estimatedHeight?: number;
}

/**
 * Represents a page of paginated content
 */
export interface PageData {
  /** Page number (1-indexed for display, starts from 3 for content pages) */
  pageNumber: number;
  /** Starting index in the rows array */
  startIndex: number;
  /** Ending index in the rows array */
  endIndex: number;
  /** Array of rows to render on this page */
  rows: PageableRow[];
}

/**
 * Section identifiers for SOP document sections
 */
export type SectionId =
  | 'purpose'
  | 'definitions'
  | 'scope'
  | 'responsibilities'
  | 'safety-concerns'
  | 'procedures'
  | 'critical-control-points'
  | 'references'
  | 'attachments';

/**
 * Props for components that can generate pageable rows
 */
export interface PageableSectionProps {
  /** Callback when rows are generated */
  onRowsGenerated?: (rows: PageableRow[]) => void;
  /** Whether the section is read-only */
  isReadOnly?: boolean;
}

/**
 * Configuration for page layout
 */
export interface PageLayoutConfig {
  /** Maximum content height per page in pixels */
  contentHeightPerPage: number;
  /** Header height in pixels */
  headerHeight: number;
  /** Footer height in pixels */
  footerHeight: number;
  /** Margin between rows in pixels */
  rowMargin: number;
}

/**
 * Default page layout configuration for A4 pages
 */
export const DEFAULT_PAGE_LAYOUT: PageLayoutConfig = {
  contentHeightPerPage: 650, // A4 height minus header/footer
  headerHeight: 80,
  footerHeight: 200,
  rowMargin: 15,
};
