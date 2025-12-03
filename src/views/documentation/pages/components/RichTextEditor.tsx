/* eslint-disable-next-line */
import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import 'summernote/dist/lang/summernote-ar-AR.js';
import axiosServices from 'src/utils/axiosServices';
import {
  CircularProgress,
  Backdrop,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  DialogActions,
  DialogTitle,
  Box
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import $ from 'jquery';
import StorageToggle from 'src/components/shared/StorageToggle';
import { useStorage, StorageType } from 'src/context/StorageContext';

export interface RichTextEditorProps {
  value: string;
  onChange: (c: string) => void;
  dir?: 'rtl' | 'ltr';
  language?: 'ar' | 'en';
  disabled?: boolean;
}

const toolbar = [
  ['style',  ['style']],
  ['font',   ['fontname', 'fontsize', 'bold', 'italic', 'underline', 'clear']],
  ['para',   ['ul', 'ol', 'paragraph']],
  ['height', ['height']],
  ['insert', ['picture', 'link', 'table']],
];
const fontAr = ['Cairo', 'Amiri', 'Tahoma', 'Arial', 'Times New Roman'];
const fontEn = ['Arial', 'Times New Roman', 'Calibri', 'Tahoma', 'Helvetica', 'Courier New'];
const sizes  = ['8','10','12','14','16','18','20','24','28','32','36','48'];
const lines  = ['0.5','1.0','1.15','1.5','2.0','3.0'];

// Convert Western numerals (0-9) to Arabic-Indic numerals (٠-٩)
const toArabicNumerals = (str: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

// Convert Arabic-Indic numerals (٠-٩) to Western numerals (0-9)
const toWesternNumerals = (str: string): string => {
  return str.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
};

// Convert numbers in text content only (not in HTML tags/attributes)
const convertNumbersInHtml = (html: string, toArabic: boolean): string => {
  if (!html) return html;
  // Split by HTML tags to only convert text content
  const parts = html.split(/(<[^>]+>)/g);
  return parts.map((part) => {
    // If it's an HTML tag, don't convert
    if (part.startsWith('<') && part.endsWith('>')) {
      return part;
    }
    // Convert text content
    return toArabic ? toArabicNumerals(part) : toWesternNumerals(part);
  }).join('');
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  dir = 'ltr',
  language = 'en',
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  // Storage type selection for image uploads
  const { defaultStorage } = useStorage();
  const [imageStorageType, setImageStorageType] = useState<StorageType>(defaultStorage);

  // Display value with Arabic numerals if language is Arabic
  const displayValue = language === 'ar' ? convertNumbersInHtml(value, true) : value;

  // Track if we're currently updating to avoid infinite loops
  const isUpdatingRef = useRef(false);
  const lastValueRef = useRef<string>('');

  // Sync editor content when value prop changes
  useEffect(() => {
    // Skip if value hasn't changed or we're in the middle of an update
    if (isUpdatingRef.current || displayValue === lastValueRef.current) return;

    const updateEditor = () => {
      const container = containerRef.current;
      if (!container) return;

      const $noteEditable = $(container).find('.note-editable');
      if ($noteEditable.length) {
        const currentContent = $noteEditable.html();
        // Only update if the content is actually different
        if (currentContent !== displayValue) {
          isUpdatingRef.current = true;
          $noteEditable.html(displayValue || '');
          lastValueRef.current = displayValue || '';
          isUpdatingRef.current = false;
        }
      }
    };

    // Use a small delay to ensure Summernote is fully initialized
    const timer = setTimeout(updateEditor, 150);
    return () => clearTimeout(timer);
  }, [displayValue]);

  // Handle onChange - store with Western numerals for consistency
  const handleChange = useCallback((content: string) => {
    // Update lastValueRef to prevent sync effect from overwriting user input
    const displayContent = language === 'ar' ? convertNumbersInHtml(content, true) : content;
    lastValueRef.current = displayContent;
    // Convert Arabic numerals back to Western for storage
    const normalizedContent = language === 'ar' ? convertNumbersInHtml(content, false) : content;
    onChange(normalizedContent);
  }, [language, onChange]);

  // Image preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Caption dialog state
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState('');
  const [pendingImageName, setPendingImageName] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Save cursor position before dialog opens
  const savedSelectionRef = useRef<Range | null>(null);

  // Cleanup modal backdrops on unmount
  useEffect(() => {
    return () => {
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
    };
  }, []);

  // Apply Arabic numerals styling when language is Arabic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applyArabicNumerals = () => {
      const noteEditable = container.querySelector('.note-editable') as HTMLElement;
      if (noteEditable) {
        if (language === 'ar') {
          noteEditable.setAttribute('lang', 'ar');
          noteEditable.style.fontFeatureSettings = '"locl"';
          // Add CSS for Arabic-Indic numerals
          const styleId = 'arabic-numerals-style';
          if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
              .note-editable[lang="ar"] {
                font-feature-settings: "locl";
              }
              .note-editable[lang="ar"] ol {
                list-style-type: arabic-indic;
              }
              @font-face {
                font-family: 'Arabic';
                src: local('Tahoma'), local('Arial');
              }
            `;
            document.head.appendChild(style);
          }
        } else {
          noteEditable.removeAttribute('lang');
          noteEditable.style.fontFeatureSettings = '';
        }
      }
    };

    // Apply after a short delay to ensure Summernote has initialized
    const timer = setTimeout(applyArabicNumerals, 100);
    return () => clearTimeout(timer);
  }, [language]);

  // Handle click on images in the editor to open preview
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.note-editable')) {
        e.preventDefault();
        e.stopPropagation();
        const imgSrc = (target as HTMLImageElement).src;
        setPreviewImage(imgSrc);
        setPreviewOpen(true);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleImageClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleImageClick);
      }
    };
  }, []);

  // Insert image with caption after user confirms - uploads with selected storage type
  const handleInsertImageWithCaption = useCallback(async () => {
    if (!pendingImageFile) return;

    setUploading(true);
    setCaptionDialogOpen(false);

    try {
      // Upload with selected storage type
      const fd = new FormData();
      fd.append('files', pendingImageFile);
      fd.append('storageType', imageStorageType);

      const res = await axiosServices.post('/api/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = Array.isArray(res.data) ? res.data[0].file_Url : res.data.file_Url;

      if (url && editorRef.current) {
        const caption = imageCaption.trim() || pendingImageName;

        // Create HTML with image and caption (image centered, caption centered below)
        const imgHtml = `
          <figure style="text-align: center; margin: 20px 0;">
            <img src="${url}" alt="${caption}" style="width: 400px; height: 180px; display: block; margin: 0 auto; cursor: pointer;" class="clickable-image" />
            <figcaption contenteditable="true" style="font-size: 12px; color: #666; margin-top: 8px; font-style: italic; text-align: center; cursor: text;">${caption}</figcaption>
          </figure>
          <p><br></p>
        `;

        // Insert the HTML into the editor at the saved cursor position
        const $noteEditable = $(containerRef.current as HTMLDivElement).find('.note-editable');
        if ($noteEditable.length) {
          $noteEditable.focus();

          // Restore the saved cursor position
          if (savedSelectionRef.current) {
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(savedSelectionRef.current);
            }
          }

          // Insert at cursor position
          document.execCommand('insertHTML', false, imgHtml);

          // Clear saved selection
          savedSelectionRef.current = null;

          // Trigger onChange with numeral conversion
          const newContent = $noteEditable.html();
          handleChange(newContent);
        }
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert(language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset states
      setPendingImageFile(null);
      setPendingImageUrl('');
      setPendingImageName('');
      setImageCaption('');
    }
  }, [pendingImageFile, pendingImageName, imageCaption, imageStorageType, handleChange, language]);

  // Handle image upload from Summernote - opens dialog first, upload happens on confirm
  const handleImageUpload = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Save current cursor position before dialog opens
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }

    // Close the Summernote modal dialog immediately
    ($('.note-modal') as any).modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');

    // Store the file and open caption/storage dialog (don't upload yet)
    setPendingImageFile(file);
    setPendingImageName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    setImageCaption('');
    setImageStorageType(defaultStorage); // Reset to default storage
    setCaptionDialogOpen(true);

    // Final cleanup of any remaining backdrops
    setTimeout(() => {
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
    }, 100);
  }, [defaultStorage]);

  // Close preview modal
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage('');
  };

  // Cancel caption dialog
  const handleCancelCaption = () => {
    setCaptionDialogOpen(false);
    setPendingImageFile(null);
    setPendingImageUrl('');
    setPendingImageName('');
    setImageCaption('');
    savedSelectionRef.current = null; // Clear saved cursor position
  };

  const options = {
    height: 200,
    toolbar,
    fontNames: language === 'ar' ? fontAr : fontEn,
    fontSizes: sizes,
    lineHeights: lines,
    dialogsInBody: true,
    placeholder: language === 'ar' ? 'اكتب هنا…' : 'Type here…',
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <Backdrop
        open={uploading}
        sx={{
          position: 'absolute',
          zIndex: 9999,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ReactSummernote
        ref={editorRef}
        value={displayValue}
        options={options}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
        lang={language === 'ar' ? 'ar-AR' : 'en-US'}
        style={{ direction: dir }}
      />

      {/* Caption Input Dialog */}
      <Dialog
        open={captionDialogOpen}
        onClose={handleCancelCaption}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
        </DialogTitle>
        <DialogContent>
          {/* Storage Type Selection */}
          <Box sx={{ mb: 3, mt: 1 }}>
            <StorageToggle
              value={imageStorageType}
              onChange={setImageStorageType}
            />
          </Box>

          {/* Caption Input */}
          <TextField
            autoFocus
            margin="dense"
            label={language === 'ar' ? 'وصف الصورة' : 'Image Caption'}
            fullWidth
            variant="outlined"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder={pendingImageName}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleInsertImageWithCaption();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCaption} color="inherit">
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleInsertImageWithCaption} variant="contained" color="primary">
            {language === 'ar' ? 'إدراج' : 'Insert'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <IconButton
          onClick={handleClosePreview}
          sx={{
            position: 'absolute',
            right: -20,
            top: -20,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            },
            zIndex: 1
          }}
        >
          <IconX size={24} />
        </IconButton>
        <DialogContent sx={{ p: 0, overflow: 'visible' }}>
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;
