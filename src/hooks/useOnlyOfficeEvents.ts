import { useEffect, useCallback } from 'react';

interface OnlyOfficeEventCallbacks {
  onSectionClick?: (sectionKey: string, data?: any) => void;
  onDocumentSaved?: () => void;
  onDocumentModified?: () => void;
  onError?: (error: any) => void;
}

// Section mapping from bookmarks to section keys
const SECTION_BOOKMARKS: Record<string, string> = {
  section_purpose: 'sop_purpose',
  section_definitions: 'Sop_Definitions',
  section_scope: 'Sop_Scope',
  section_procedures: 'Sop_Procedures',
  section_responsibilities: 'Sop_Res',
  section_safety: 'Sop_Safety_Concerns',
  section_critical: 'sop_CriticalControlPoints',
  section_references: 'Sop_Refrences',
};

export function useOnlyOfficeEvents(callbacks: OnlyOfficeEventCallbacks) {
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Validate origin if needed
      // if (event.origin !== expectedOrigin) return;

      const { type, section, data, error } = event.data || {};

      switch (type) {
        case 'SECTION_HEADER_CLICKED':
          if (section && callbacks.onSectionClick) {
            // Map bookmark to section key
            const sectionKey = SECTION_BOOKMARKS[section] || section;
            callbacks.onSectionClick(sectionKey, data);
          }
          break;

        case 'DOCUMENT_SAVED':
          callbacks.onDocumentSaved?.();
          break;

        case 'DOCUMENT_MODIFIED':
          callbacks.onDocumentModified?.();
          break;

        case 'EDITOR_ERROR':
          callbacks.onError?.(error);
          break;

        default:
          // Ignore unknown message types
          break;
      }
    },
    [callbacks]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);
}

// Helper to get section display name
export function getSectionDisplayName(sectionKey: string): { en: string; ar: string } {
  const names: Record<string, { en: string; ar: string }> = {
    sop_purpose: { en: 'Purpose', ar: 'الغرض' },
    Sop_Definitions: { en: 'Definitions', ar: 'التعريفات' },
    Sop_Scope: { en: 'Scope', ar: 'النطاق' },
    Sop_Procedures: { en: 'Procedures', ar: 'الإجراءات' },
    Sop_Res: { en: 'Responsibilities', ar: 'المسؤوليات' },
    Sop_Safety_Concerns: { en: 'Safety Concerns', ar: 'اعتبارات السلامة' },
    sop_CriticalControlPoints: { en: 'Critical Control Points', ar: 'نقاط التحكم الحرجة' },
    Sop_Refrences: { en: 'Reference Documents', ar: 'الوثائق المرجعية' },
  };

  return names[sectionKey] || { en: sectionKey, ar: sectionKey };
}

// Get bookmark ID from section key
export function getSectionBookmark(sectionKey: string): string {
  const entry = Object.entries(SECTION_BOOKMARKS).find(([, value]) => value === sectionKey);
  return entry ? entry[0] : sectionKey;
}

export default useOnlyOfficeEvents;
