// QMS\src\components\OnlyOffice\OnlyOfficeEditor.tsx
import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

declare global {
  interface Window {
    DocsAPI: any;
  }
}

interface OnlyOfficeEditorProps {
  config: any;
  documentServerUrl?: string;
  onDocumentReady?: () => void;
  onError?: (error: any) => void;
  onDocumentStateChange?: (event: any) => void;
  onSectionClick?: (sectionKey: string) => void;
}

export interface OnlyOfficeEditorRef {
  save: () => void;
  print: () => void;
  reload: (newConfig: any) => void;
}

const OnlyOfficeEditor = forwardRef<OnlyOfficeEditorRef, OnlyOfficeEditorProps>(
  (
    {
      config,
      // Connect directly to OnlyOffice server (proxy has connectivity issues)
      documentServerUrl: _documentServerUrl = import.meta.env.VITE_ONLYOFFICE_SERVER_URL || 'https://qualitylead-qms.duckdns.org/onlyoffice/',
      onDocumentReady,
      onError,
      onDocumentStateChange,
      onSectionClick,
    },
    ref
  ) => {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitializedRef = useRef(false);
    const configKeyRef = useRef<string | null>(null);
    const configRef = useRef(config);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editorUrl, setEditorUrl] = useState<string | null>(null);

    // Store callbacks in refs to avoid re-renders
    const onDocumentReadyRef = useRef(onDocumentReady);
    const onErrorRef = useRef(onError);
    const onDocumentStateChangeRef = useRef(onDocumentStateChange);

    useEffect(() => {
      onDocumentReadyRef.current = onDocumentReady;
      onErrorRef.current = onError;
      onDocumentStateChangeRef.current = onDocumentStateChange;
    }, [onDocumentReady, onError, onDocumentStateChange]);

    // Keep config ref updated
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    // Store editor URL for reference (without triggering re-renders or calling callbacks)
    useEffect(() => {
      if (!config) return;
      const docUrl = config.document?.url;
      if (docUrl && docUrl !== editorUrl) {
        setEditorUrl(docUrl);
      }
    }, [config, editorUrl]);

    // Listen for messages from ONLYOFFICE
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        // Handle section click messages
        if (event.data?.type === 'SECTION_HEADER_CLICKED' && onSectionClick) {
          onSectionClick(event.data.section);
        }
        // Handle document state changes
        if (event.data?.type === 'DOCUMENT_STATE_CHANGE') {
          onDocumentStateChange?.(event.data);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [onSectionClick, onDocumentStateChange]);

    // Script-based initialization
    const initWithScript = useCallback(async () => {
      const currentConfig = configRef.current;

      if (!currentConfig) {
        console.log('[OnlyOffice] No config provided, skipping initialization');
        return;
      }

      if (!containerRef.current) {
        console.error('[OnlyOffice] Container ref not available');
        return;
      }

      // Get document key to track if we need to reinitialize
      const docKey = currentConfig.document?.key;

      // Prevent multiple initializations for the same document
      if (isInitializedRef.current && configKeyRef.current === docKey && editorRef.current) {
        console.log('[OnlyOffice] Already initialized for this document, skipping');
        return;
      }

      console.log('[OnlyOffice] Starting initialization with config:', currentConfig);

      try {
        setLoading(true);
        setError(null);

        // Wait for ONLYOFFICE API to be available (loaded from index.html)
        await new Promise<void>((resolve, reject) => {
          if (window.DocsAPI) {
            console.log('[OnlyOffice] DocsAPI already available');
            resolve();
            return;
          }

          console.log('[OnlyOffice] Waiting for DocsAPI to load...');
          let attempts = 0;
          const maxAttempts = 50;
          const checkInterval = setInterval(() => {
            attempts++;
            if (window.DocsAPI) {
              console.log('[OnlyOffice] DocsAPI loaded after', attempts * 100, 'ms');
              clearInterval(checkInterval);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
              reject(new Error('ONLYOFFICE API not available. Check if the document server is accessible.'));
            }
          }, 100);
        });

        // Destroy existing editor if exists
        if (editorRef.current) {
          try {
            editorRef.current.destroyEditor();
          } catch (e) {
            console.warn('Error destroying editor:', e);
          }
          editorRef.current = null;
        }

        // Create editor config with events (use refs for callbacks)
        const editorConfig = {
          ...currentConfig,
          type: 'desktop',
          height: '100%',
          width: '100%',
          events: {
            onDocumentReady: () => {
              console.log('[OnlyOffice] Document ready!');
              setLoading(false);
              onDocumentReadyRef.current?.();
            },
            onError: (event: any) => {
              console.error('[OnlyOffice] Error:', event);
              setLoading(false);
              setError(event?.data?.message || 'Editor error occurred');
              onErrorRef.current?.(event);
            },
            onDocumentStateChange: (event: any) => {
              onDocumentStateChangeRef.current?.(event);
            },
            onAppReady: () => {
              console.log('[OnlyOffice] App ready (editor UI loaded)');
              // Hide loading when app is ready
              setLoading(false);
            },
          },
        };

        console.log('[OnlyOffice] Creating DocEditor with config:', editorConfig);
console.log('[OnlyOffice] ONLYOFFICE CONFIG:', JSON.stringify(config, null, 2));
        // Create editor using DOM element reference (not string ID)
        editorRef.current = new window.DocsAPI.DocEditor(containerRef.current, editorConfig);
        isInitializedRef.current = true;
        configKeyRef.current = docKey;
        console.log('[OnlyOffice] DocEditor created successfully');

      } catch (err: any) {
        console.error('[OnlyOffice] Error initializing:', err);
        setLoading(false);
        setError(err.message || 'Failed to initialize editor');
        onErrorRef.current?.(err);
      }
    }, []); // Empty dependency - uses refs for all values

    // Initialize editor on mount only
    useEffect(() => {
      // Wait for container to be mounted before initializing
      if (containerRef.current) {
        initWithScript();
      }

      return () => {
        if (editorRef.current) {
          try {
            editorRef.current.destroyEditor();
          } catch (e) {
            console.warn('Error destroying editor on unmount:', e);
          }
          editorRef.current = null;
        }
        isInitializedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency - only run on mount/unmount

    // Reinitialize when document key changes while staying mounted (avoids unmount/remount churn)
    useEffect(() => {
      if (config?.document?.key && containerRef.current) {
        initWithScript();
      }
    }, [config?.document?.key, initWithScript, config]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      save: () => {
        try {
          if (editorRef.current) {
            editorRef.current.triggerForceSave?.();
          }
        } catch (e) {
          console.warn('Error triggering save:', e);
        }
      },
      print: () => {
        try {
          if (editorRef.current) {
            editorRef.current.serviceCommand?.('print');
          }
        } catch (e) {
          console.warn('Error triggering print:', e);
        }
      },
      reload: () => {
        initWithScript();
      },
    }));

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '700px',
          position: 'relative',
          bgcolor: '#f5f5f5',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 10,
            }}
          >
            <CircularProgress size={48} />
            <Typography sx={{ mt: 2 }} variant="h6">
              Loading Document Editor...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while ONLYOFFICE initializes
            </Typography>
          </Box>
        )}
        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 10,
              p: 3,
            }}
          >
            <Typography color="error" variant="h6" gutterBottom>
              Error Loading Editor
            </Typography>
            <Typography color="error" align="center">
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Try refreshing the page or check your connection
            </Typography>
          </Box>
        )}
        <div
          ref={containerRef}
          id="onlyoffice-editor-container"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '700px',
          }}
        />
      </Box>
    );
  }
);

OnlyOfficeEditor.displayName = 'OnlyOfficeEditor';

export default OnlyOfficeEditor;
