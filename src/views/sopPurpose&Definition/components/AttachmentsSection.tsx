/* عرض وإضافة المرفقات */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';

interface Attachment {
  Id: string;
  FileName: string;
  FileUrl: string;
}

const AttachmentsSection: React.FC<{ headerId: string }> = ({ headerId }) => {
  const [attchs, setAttchs] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchAll = () =>
    axiosServices
      .get(`/api/sopAttachments/list/${headerId}`)
      .then((r) => setAttchs(r.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    fetchAll();
  }, [headerId]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('Sop_HeaderId', headerId);
    Array.from(e.target.files).forEach((f) => fd.append('files', f));
    axiosServices
      .post('/api/sopAttachments/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(fetchAll)
      .finally(() => setUploading(false));
  };

  const handleDelete = (id: string) =>
    axiosServices
      .delete(`/api/sopAttachments/delete/${id}`)
      .then(fetchAll)
      .catch((err) => console.error(err));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Attachments / المرفقات
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
        {attchs.map((a) => (
          <ListItem
            key={a.Id}
            secondaryAction={
              <IconButton edge="end" color="error" onClick={() => handleDelete(a.Id)}>
                <IconTrash size={20} />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <a href={a.FileUrl} target="_blank" rel="noreferrer">
                  {a.FileName}
                </a>
              }
            />
          </ListItem>
        ))}
        {!attchs.length && <Typography variant="body2">No attachments</Typography>}
      </List>
    </Box>
  );
};
export default AttachmentsSection;
