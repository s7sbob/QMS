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
import axiosServices from 'src/utils/axiosServices';

const NewCreation: React.FC = () => {
  // State للاحتفاظ بملفات المرفقات (إن أردت لاحقًا رفعها لسيرفر)
  const [attachments, setAttachments] = useState<File[]>([]);

  // State للحقول العربية والإنجليزية
  const [formData, setFormData] = useState({
    // عربي
    titleAr: '',
    codeAr: '',
    versionAr: '',
    issueDateAr: '',
    effectiveDateAr: '',
    revisionDateAr: '',
    purposeAr: '',
    definitionsAr: '',
    scopeAr: '',
    responsibilityAr: '',
    safetyConcernsAr: '',
    procedureAr: '',
    referenceDocumentsAr: '',

    // إنجليزي
    titleEn: '',
    codeEn: '',
    versionEn: '',
    issueDateEn: '',
    effectiveDateEn: '',
    revisionDateEn: '',
    purposeEn: '',
    definitionsEn: '',
    scopeEn: '',
    responsibilityEn: '',
    safetyConcernsEn: '',
    procedureEn: '',
    referenceDocumentsEn: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setAttachments((prev) => [...prev, ...filesArray]);
    }
  };

  const handleFileDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 1) إنشاء أو تعديل الـ Header
      // حسبما يتطلب الـ backend
      const headerPayload = {
        Doc_Title_en: formData.titleEn,
        Doc_Title_ar: formData.titleAr,
        Doc_Code: formData.codeEn || formData.codeAr,
        Version: formData.versionEn ? parseInt(formData.versionEn) : 1,
        Issue_Date: formData.issueDateEn,
        Effective_Date: formData.effectiveDateEn,
        Revision_Date: formData.revisionDateEn,
        // ... حقول أخرى لو لزم
      };
      const headerResponse = await axiosServices.post(
        '/api/sopheader/addeditsop-Header',
        headerPayload
      );
      const headerId = headerResponse.data?.Id;
      if (!headerId) {
        alert('لم يرجع السيرفر بمعرف Header صالح');
        return;
      }

      // رقم الإصدار (لإعادة استخدامه)
      const versionNumber = formData.versionEn ? parseInt(formData.versionEn) : 1;

      // 2) إضافة Definitions
      if (formData.definitionsEn || formData.definitionsAr) {
        const defPayload = {
          Content_en: formData.definitionsEn,
          Content_ar: formData.definitionsAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopDefinition/addSop-Definition', defPayload);
      }

      // 3) إضافة Purpose
      if (formData.purposeEn || formData.purposeAr) {
        const purposePayload = {
          Content_en: formData.purposeEn,
          Content_ar: formData.purposeAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/soppurpose/addSop-Purpose', purposePayload);
      }

      // 4) إضافة Responsibilities
      if (formData.responsibilityEn || formData.responsibilityAr) {
        const resPayload = {
          Content_en: formData.responsibilityEn,
          Content_ar: formData.responsibilityAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopRes/addSop-Res', resPayload);
      }

      // 5) إضافة Procedures
      if (formData.procedureEn || formData.procedureAr) {
        const procPayload = {
          Content_en: formData.procedureEn,
          Content_ar: formData.procedureAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/soprocedures/addSop-Procedure', procPayload);
      }

      // 6) إضافة Scope
      if (formData.scopeEn || formData.scopeAr) {
        const scopePayload = {
          Content_en: formData.scopeEn,
          Content_ar: formData.scopeAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopScope/addSop-Scope', scopePayload);
      }

      // 7) إضافة SafetyConcerns
      if (formData.safetyConcernsEn || formData.safetyConcernsAr) {
        const safetyPayload = {
          Content_en: formData.safetyConcernsEn,
          Content_ar: formData.safetyConcernsAr,
          Version: versionNumber,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post(
          '/api/sopSafetyConcerns/addSop-SafetyConcerns',
          safetyPayload
        );
      }

      // رفع المرفقات - إن كان لديك Endpoint خاص لذلك (ليس موجودًا بالـ Swagger)
      /*
      if (attachments.length > 0) {
        const formDataFiles = new FormData();
        attachments.forEach((file) => {
          formDataFiles.append('files', file);
        });
        formDataFiles.append('Sop_HeaderId', headerId);

        await axiosServices.post('/api/sopFiles/upload', formDataFiles, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      */

      alert('تم إنشاء الـ SOP بنجاح وإرسال كل جزء للـ Endpoint الخاص به.');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إنشاء الـ SOP. راجع الـ Console لمعرفة التفاصيل.');
    }
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
                value={formData.titleAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="كود الوثيقة:"
                id="codeAr"
                name="codeAr"
                variant="outlined"
                margin="normal"
                value={formData.codeAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="رقم الإصدار:"
                id="versionAr"
                name="versionAr"
                variant="outlined"
                margin="normal"
                value={formData.versionAr}
                onChange={handleInputChange}
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
                value={formData.issueDateAr}
                onChange={handleInputChange}
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
                value={formData.effectiveDateAr}
                onChange={handleInputChange}
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
                value={formData.revisionDateAr}
                onChange={handleInputChange}
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
                value={formData.purposeAr}
                onChange={handleInputChange}
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
                value={formData.definitionsAr}
                onChange={handleInputChange}
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
                value={formData.scopeAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="المسئـولية:"
                id="responsibilityAr"
                name="responsibilityAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.responsibilityAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="اشتراطـات السلامة:"
                id="safetyConcernsAr"
                name="safetyConcernsAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.safetyConcernsAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="الخطـــوات:"
                id="procedureAr"
                name="procedureAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.procedureAr}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="الوثائـق المرجعيـــة:"
                id="referenceDocumentsAr"
                name="referenceDocumentsAr"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.referenceDocumentsAr}
                onChange={handleInputChange}
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
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
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
                id="titleEn"
                name="titleEn"
                variant="outlined"
                margin="normal"
                value={formData.titleEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Code Number:"
                id="codeEn"
                name="codeEn"
                variant="outlined"
                margin="normal"
                value={formData.codeEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Version Number:"
                id="versionEn"
                name="versionEn"
                variant="outlined"
                margin="normal"
                value={formData.versionEn}
                onChange={handleInputChange}
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
                value={formData.issueDateEn}
                onChange={handleInputChange}
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
                value={formData.effectiveDateEn}
                onChange={handleInputChange}
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
                value={formData.revisionDateEn}
                onChange={handleInputChange}
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
                value={formData.purposeEn}
                onChange={handleInputChange}
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
                value={formData.definitionsEn}
                onChange={handleInputChange}
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
                value={formData.scopeEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Responsibility:"
                id="responsibilityEn"
                name="responsibilityEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.responsibilityEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Safety Concerns:"
                id="safetyConcernsEn"
                name="safetyConcernsEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.safetyConcernsEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Procedure:"
                id="procedureEn"
                name="procedureEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.procedureEn}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Reference Documents:"
                id="referenceDocumentsEn"
                name="referenceDocumentsEn"
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                value={formData.referenceDocumentsEn}
                onChange={handleInputChange}
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
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
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
