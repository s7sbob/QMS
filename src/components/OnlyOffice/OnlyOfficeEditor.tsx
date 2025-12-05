// QMS\src\components\OnlyOffice\OnlyOfficeEditor.tsx
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

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
  reload: (newConfig?: any) => void;
}

const OnlyOfficeEditor = forwardRef<OnlyOfficeEditorRef, OnlyOfficeEditorProps>(
  (
    {
      config,
      documentServerUrl: _documentServerUrl =
        import.meta.env.VITE_ONLYOFFICE_SERVER_URL ||
        "https://qualitylead-qms.duckdns.org/onlyoffice/",
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

    // Store callbacks in refs
    const onDocumentReadyRef = useRef(onDocumentReady);
    const onErrorRef = useRef(onError);
    const onDocumentStateChangeRef = useRef(onDocumentStateChange);

    useEffect(() => {
      onDocumentReadyRef.current = onDocumentReady;
      onErrorRef.current = onError;
      onDocumentStateChangeRef.current = onDocumentStateChange;
    }, [onDocumentReady, onError, onDocumentStateChange]);

    // Keep incoming config in a ref
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    // Just for debugging: store URL sent from backend
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
        if (event.data?.type === "SECTION_HEADER_CLICKED" && onSectionClick) {
          onSectionClick(event.data.section);
        }
        if (event.data?.type === "DOCUMENT_STATE_CHANGE") {
          onDocumentStateChange?.(event.data);
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [onSectionClick, onDocumentStateChange]);

    // Main init function
    const initWithScript = useCallback(async () => {
      // نقرأ الكونفيج الأصلي (لو حبيت تستخدمه بعدين)
      const rawConfig = configRef.current || {};

      if (!containerRef.current) {
        console.error("[OnlyOffice] Container ref not available");
        return;
      }

      // ⚠️ حالياً نستخدم config نظيف وبسيط (بدون token) لفتح testonlyoffice.docx
      // Clone and strip any token fields before sending config to ONLYOFFICE
      const sanitizedConfig: any = JSON.parse(JSON.stringify(rawConfig || {}));
      delete sanitizedConfig.token;
      if (sanitizedConfig.document) {
        delete sanitizedConfig.document.token;
      }
      if (sanitizedConfig.editorConfig) {
        delete sanitizedConfig.editorConfig.token;
      }

      const docKey = sanitizedConfig.document?.key;

      if (
        isInitializedRef.current &&
        configKeyRef.current === docKey &&
        editorRef.current
      ) {
        console.log(
          "[OnlyOffice] Already initialized for this document, skipping"
        );
        return;
      }

      console.log(
        "[OnlyOffice] Starting initialization with CLEAN config (no token):",
        sanitizedConfig
      );

      try {
        setLoading(true);
        setError(null);

        // Wait for ONLYOFFICE API to be available (loaded from index.html)
        await new Promise<void>((resolve, reject) => {
          if (window.DocsAPI) {
            console.log("[OnlyOffice] DocsAPI already available");
            resolve();
            return;
          }

          console.log("[OnlyOffice] Waiting for DocsAPI to load...");
          let attempts = 0;
          const maxAttempts = 50;
          const checkInterval = setInterval(() => {
            attempts++;
            if (window.DocsAPI) {
              console.log(
                "[OnlyOffice] DocsAPI loaded after",
                attempts * 100,
                "ms"
              );
              clearInterval(checkInterval);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
              reject(
                new Error(
                  "ONLYOFFICE API not available. Check if the document server is accessible."
                )
              );
            }
          }, 100);
        });

        // Destroy existing editor if exists
        if (editorRef.current) {
          try {
            editorRef.current.destroyEditor();
          } catch (e) {
            console.warn("Error destroying editor:", e);
          }
          editorRef.current = null;
        }

        const baseEvents = sanitizedConfig.events || {};
        const editorConfig: any = {
          ...sanitizedConfig,
          type: sanitizedConfig.type || "desktop",
          height: sanitizedConfig.height || "100%",
          width: sanitizedConfig.width || "100%",
          events: {
            ...baseEvents,
            onDocumentReady: () => {
              console.log("[OnlyOffice] Document ready!");
              setLoading(false);
              onDocumentReadyRef.current?.();
            },
            onError: (event: any) => {
              console.error("[OnlyOffice] Error:", event);
              setLoading(false);
              setError(
                event?.data?.message || "Editor error occurred (check logs)"
              );
              onErrorRef.current?.(event);
            },
            onDocumentStateChange: (event: any) => {
              onDocumentStateChangeRef.current?.(event);
            },
            onAppReady: () => {
              console.log("[OnlyOffice] App ready (editor UI loaded)");
              setLoading(false);
            },
          },
        };

        console.log(
          "[OnlyOffice] Creating DocEditor with config:",
          editorConfig
        );
        console.log(
          "[OnlyOffice] ONLYOFFICE CONFIG (final sent to DocEditor):",
          JSON.stringify(editorConfig, null, 2)
        );

        editorRef.current = new window.DocsAPI.DocEditor(
          containerRef.current,
          editorConfig
        );
        isInitializedRef.current = true;
        configKeyRef.current = docKey;
        console.log("[OnlyOffice] DocEditor created successfully");
      } catch (err: any) {
        console.error("[OnlyOffice] Error initializing:", err);
        setLoading(false);
        setError(err.message || "Failed to initialize editor");
        onErrorRef.current?.(err);
      }
    }, []); // uses refs

    // Initialize editor on mount
    useEffect(() => {
      if (containerRef.current) {
        initWithScript();
      }

      return () => {
        if (editorRef.current) {
          try {
            editorRef.current.destroyEditor();
          } catch (e) {
            console.warn("Error destroying editor on unmount:", e);
          }
          editorRef.current = null;
        }
        isInitializedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reinitialize when document key changes (لو حبيت تستخدمه بعدين)
    useEffect(() => {
      if (config?.document?.key && containerRef.current) {
        initWithScript();
      }
    }, [config?.document?.key, initWithScript, config]);

    // Expose methods
    useImperativeHandle(ref, () => ({
      save: () => {
        try {
          if (editorRef.current) {
            editorRef.current.triggerForceSave?.();
          }
        } catch (e) {
          console.warn("Error triggering save:", e);
        }
      },
      print: () => {
        try {
          if (editorRef.current) {
            editorRef.current.serviceCommand?.("print");
          }
        } catch (e) {
          console.warn("Error triggering print:", e);
        }
      },
      reload: () => {
        initWithScript();
      },
    }));

    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "700px",
          position: "relative",
          bgcolor: "#f5f5f5",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={48} />
            <Typography sx={{ mt: 2 }} variant="h6">
              Loading Document Editor...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while ONLYOFFICE initializes test ui
            </Typography>
          </Box>
        )}
        {error && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
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
            width: "100%",
            height: "100%",
            minHeight: "700px",
          }}
        />
      </Box>
    );
  }
);

OnlyOfficeEditor.displayName = "OnlyOfficeEditor";

export default OnlyOfficeEditor;
