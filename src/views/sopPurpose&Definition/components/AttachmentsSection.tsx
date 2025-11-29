import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  IconUpload,
  IconTrash,
  IconEye,
  IconDownload,
} from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';

interface Attachment {
  Id: string;
  file_Url: string;
  file_Type: string;
  File_Name: string | null;
  Crt_Date: string | null;
}

const AttachmentsSection: React.FC<{ headerId: string }> = ({ headerId }) => {
  const [attchs, setAttchs] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = () =>
    axiosServices
      .get<Attachment[]>(`/api/files/list/${headerId}`)
      .then((r) => setAttchs(r.data))
      .catch(console.error);

  useEffect(() => {
    fetchAll();
  }, [headerId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
    setUploadDialogOpen(true);
  };

  const handleUploadConfirm = () => {
    if (!selectedFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('Sop_HeadId', headerId);
    fd.append('File_Name', fileName);
    fd.append('files', selectedFile);
    axiosServices
      .post('/api/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(fetchAll)
      .finally(() => {
        setUploading(false);
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const handleUploadCancel = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) =>
    axiosServices
      .delete(`/api/files/delete/${id}`)
      .then(fetchAll)
      .catch(console.error);

  const openPreview = (file: Attachment) => setPreviewFile(file);
  const closePreview = () => setPreviewFile(null);

  const getName = (attachment: Attachment) =>
    attachment.File_Name || attachment.file_Url.split('/').pop() || '';

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        المرفقات / Attachments
      </Typography>

      <Button
        variant="outlined"
        component="label"
        startIcon={<IconUpload />}
        disabled={uploading}
        sx={{ mb: 2 }}
      >
        {uploading ? 'Uploading…' : 'Add Attachment'}
        <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} />
      </Button>

      <List>
        {attchs.map((a) => {
          const name = getName(a);
          return (
            <ListItem key={a.Id} divider>
              <ListItemText primary={name} />

              <IconButton edge="end" onClick={() => openPreview(a)} title="Preview">
                <IconEye size={20} />
              </IconButton>

              <IconButton
                component="a"
                href={a.file_Url}
                download={name}
                edge="end"
                title="Download"
              >
                <IconDownload size={20} />
              </IconButton>

              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDelete(a.Id)}
                title="Delete"
              >
                <IconTrash size={20} />
              </IconButton>
            </ListItem>
          );
        })}

        {!attchs.length && (
          <Typography variant="body2" sx={{ pl: 2 }}>
            لا توجد مرفقات
          </Typography>
        )}
      </List>

      {/* Upload Dialog with File Name input */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Attachment / رفع مرفق</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name / اسم الملف"
            type="text"
            fullWidth
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ mt: 2 }}
          />
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadCancel}>Cancel</Button>
          <Button
            onClick={handleUploadConfirm}
            variant="contained"
            disabled={uploading || !fileName.trim()}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Preview / PDF Viewer Dialog  */}
      <Dialog
        open={!!previewFile}
        onClose={closePreview}
        maxWidth={false}
        fullScreen={false}
        PaperProps={{
          sx: {
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
            m: 'auto'
          }
        }}
      >
        <DialogTitle>
          {previewFile && getName(previewFile)}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', height: 'calc(90vh - 130px)', p: 0 }}>
          {previewFile?.file_Type.startsWith('image/') ? (
            <img
              src={previewFile.file_Url}
              alt={previewFile ? getName(previewFile) : ''}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            // PDF viewer
            <object
              data={previewFile?.file_Url}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <Typography>
                لا يمكن عرض الـ PDF في المستعرض. الرجاء تحميله.
              </Typography>
            </object>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<IconDownload />}
            component="a"
            href={previewFile?.file_Url}
            download={previewFile ? getName(previewFile) : ''}
          >
            Download
          </Button>
          <Button onClick={closePreview}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AttachmentsSection;
