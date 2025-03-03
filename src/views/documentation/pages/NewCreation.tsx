// src/pages/NewCreation.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';

const NewCreation: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const handleFileDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper sx={{ p: 4, m: 2 }}>
      {/* Header */}
      <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4">CREATION SOP</Typography>
        <Typography variant="subtitle1">Standard Operating Procedure (SOP)</Typography>
      </Box>

      <Container>
        <form id="sopForm" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* العمود العربي */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'right', direction: 'rtl' }}>
              <Typography variant="h5" gutterBottom>
                العربية
              </Typography>
              <TextField
                fullWidth
                label="عنوان الوثيقة:"
                id="titleAr"
                name="titleAr"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="كود الوثيقة:"
                id="codeAr"
                name="codeAr"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="رقم الإصدار:"
                id="versionAr"
                name="versionAr"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="تاريخ الإصدار:"
                id="issueDateAr"
                name="issueDateAr"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="تاريخ الفعالية:"
                id="effectiveDateAr"
                name="effectiveDateAr"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="تاريخ المراجعة:"
                id="revisionDateAr"
                name="revisionDateAr"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                المحتوى
              </Typography>
              <TextField
                fullWidth
                label="الغرض:"
                id="purposeAr"
                name="purposeAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="التعريفات:"
                id="definitionsAr"
                name="definitionsAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="مجال التطبيق:"
                id="scopeAr"
                name="scopeAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="المسئـولية:"
                id="ResponsibilityAr"
                name="ResponsibilityAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="الإحتياطـات الواجبــة:"
                id="SafetyConcernsAr"
                name="SafetyConcernsAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="الخطـــوات:"
                id="ProcedureAr"
                name="ProcedureAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="الوثائـق المرجعيـــة:"
                id="ReferenceDocumentsAr"
                name="ReferenceDocumentsAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  المرفقـــات:
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<IconUpload />}
                  sx={{ mb: 2 }}
                >
                  رفع الملفات
                  <input type="file" multiple hidden onChange={handleFileUpload} />
                </Button>

                <List>
                  {attachments.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleFileDelete(index)}
                          color="error"
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>

            {/* العمود الإنجليزي */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'left', direction: 'ltr' }}>
              <Typography variant="h5" gutterBottom>
                English
              </Typography>
              <TextField
                fullWidth
                label="Title Name:"
                id="Title"
                name="Title"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Code Number:"
                id="codeEn"
                name="codeEn"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Version Number:"
                id="versionEn"
                name="versionEn"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Issue Date:"
                id="issueDateEn"
                name="issueDateEn"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Effective Date:"
                id="effectiveDateEn"
                name="effectiveDateEn"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Revision Date:"
                id="revisionDateEn"
                name="revisionDateEn"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Content
              </Typography>
              <TextField
                fullWidth
                label="Purpose:"
                id="purposeEn"
                name="purposeEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Definitions:"
                id="definitionsEn"
                name="definitionsEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Scope:"
                id="scopeEn"
                name="scopeEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Responsibility:"
                id="ResponsibilityEn"
                name="ResponsibilityEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Safety Concerns:"
                id="SafetyConcernsEn"
                name="SafetyConcernsEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Procedure:"
                id="ProcedureEn"
                name="ProcedureEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Reference Documents:"
                id="ReferenceDocumentsEn"
                name="ReferenceDocumentsEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
              />
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Attachments:
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<IconUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload Files
                  <input type="file" multiple hidden onChange={handleFileUpload} />
                </Button>

                <List>
                  {attachments.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleFileDelete(index)}
                          color="error"
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>

          {/* الأزرار */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={handlePrint}>
              cancel
            </Button>
            <Button variant="contained" type="submit">
              submit
            </Button>
          </Box>
        </form>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2">
          Unauthorized duplication is prohibited | يمنع إعادة الطباعة لغير المختصين
        </Typography>
      </Box>
    </Paper>
  );
};

export default NewCreation;
