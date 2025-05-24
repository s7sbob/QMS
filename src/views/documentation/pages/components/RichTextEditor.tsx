/* eslint-disable-next-line */
import React, { useCallback, useRef } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import 'summernote/dist/lang/summernote-ar-AR.js';
import axiosServices from 'src/utils/axiosServices';

export interface RichTextEditorProps {
  value: string;
  onChange: (c: string) => void;
  dir?: 'rtl' | 'ltr';
  language?: 'ar' | 'en';
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

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  dir = 'ltr',
  language = 'en',
}) => {
  /* ✅ مرجع للمحرّر */
  const editorRef = useRef<any>(null);

  /* —— رفع الصورة ثم إدراجها فى هذا المحرّر بالضبط —— */
  const handleImageUpload = useCallback(async (files: File[]) => {
    const file = files[0];
    try {
      const fd = new FormData();
      fd.append('files', file);
      const res = await axiosServices.post('/api/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = Array.isArray(res.data) ? res.data[0].file_Url : res.data.file_Url;

      /* 🚀 يدخل الصورة فى المكوّن الحالى فقط */
      editorRef.current?.insertImage(url, file.name);
    } catch (err) {
      console.error('رفع الصورة فشل', err);
    }
  }, []);

  const options = {
    height: 200,
    toolbar,
    fontNames: language === 'ar' ? fontAr : fontEn,
    fontSizes: sizes,
    lineHeights: lines,
    dialogsInBody: false,
    placeholder: language === 'ar' ? 'اكتب هنا…' : 'Type here…',
  };

  return (
    <ReactSummernote
      ref={editorRef}                      /* ← المرجع */
      value={value}
      options={options}
      onChange={onChange}
      onImageUpload={handleImageUpload}
      lang={language === 'ar' ? 'ar-AR' : 'en-US'}
      style={{ direction: dir }}
    />
  );
};

export default RichTextEditor;
