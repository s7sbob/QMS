import React, { useEffect, useState } from 'react';
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
  Crt_Date: string | null;
}

const AttachmentsSection: React.FC<{ headerId: string }> = ({ headerId }) => {
  const [attchs, setAttchs] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);

  const fetchAll = () =>
    axiosServices
      .get<Attachment[]>(`/api/files/list/${headerId}`)
      .then((r) => setAttchs(r.data))
      .catch(console.error);

  useEffect(() => {
    fetchAll();
  }, [headerId]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('Sop_HeadId', headerId);
    Array.from(e.target.files).forEach((f) => fd.append('files', f));
    axiosServices
      .post('/api/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(fetchAll)
      .finally(() => setUploading(false));
  };

  const handleDelete = (id: string) =>
    axiosServices
      .delete(`/api/files/delete/${id}`)
      .then(fetchAll)
      .catch(console.error);

  const openPreview = (file: Attachment) => setPreviewFile(file);
  const closePreview = () => setPreviewFile(null);

  const getName = (url: string) => url.split('/').pop() || '';

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
        <input type="file" multiple hidden onChange={handleUpload} />
      </Button>

      <List>
        {attchs.map((a) => {
          const name = getName(a.file_Url);
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
    {previewFile && getName(previewFile.file_Url)}
  </DialogTitle>
  <DialogContent sx={{ textAlign: 'center', height: 'calc(90vh - 130px)', p: 0 }}>
    {previewFile?.file_Type.startsWith('image/') ? (
      <img
        src={previewFile.file_Url}
        alt={getName(previewFile.file_Url)}
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
      download={getName(previewFile?.file_Url || '')}
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
