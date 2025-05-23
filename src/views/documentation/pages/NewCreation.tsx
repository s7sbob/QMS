/* eslint-disable @typescript-eslint/no-explicit-any */
// ────────────────────────────────────────────────────────────────────────────────
// src/pages/NewCreation.tsx
// آخر تحديث: 23-مايو-2025
// • سمرنوت أصبح عبر <RichTextEditor> القابل لإدراج الصور والجداول
// ────────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  GlobalStyles,
  SelectChangeEvent,
  Backdrop,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import RichTextEditor from './components/RichTextEditor'; // ⬅️ الجديد

/* ╭──────────────────────────────────────────────────────────────╮
   │ أنواع البيانات                                               │
   ╰──────────────────────────────────────────────────────────────╯ */
interface Department {
  Id: string;
  Dept_name: string;
}

/* ╭──────────────────────────────────────────────────────────────╮
   │ المكوّن الرئيسي                                               │
   ╰──────────────────────────────────────────────────────────────╯ */
const NewCreation: React.FC = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const user = useContext(UserContext);
  const compId = user?.compId || '';
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [containTraining, setContainTraining] = useState(false);

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    purposeAr: '',
    definitionsAr: '',
    scopeAr: '',
    responsibilityAr: '',
    safetyConcernsAr: '',
    procedureAr: '',
    referenceDocumentsAr: '',
    purposeEn: '',
    definitionsEn: '',
    scopeEn: '',
    responsibilityEn: '',
    safetyConcernsEn: '',
    procedureEn: '',
    referenceDocumentsEn: '',
    criticalPointsAr: '',
    criticalPointsEn: '',
    documentType: 'SOP',
  });

  const creationDate = new Date().toISOString().slice(0, 10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ────────────────────────────── جلب الأقسام ───────────────────────────── */
  useEffect(() => {
    if (compId) {
      setLoading(true);
      axiosServices
        .get(`/api/department/compdepartments/${compId}`)
        .then((res) => {
          let data = res.data;
          if (!Array.isArray(data)) {
            try {
              data = JSON.parse(data);
            } catch {
              data = [];
            }
          }
          setDepartments(data);
        })
        .catch((err) => console.error('Error fetching departments:', err))
        .finally(() => setLoading(false));
    }
  }, [compId]);

  /* ───────────────────────────── معالجات الإدخال ─────────────────────────── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...filesArray]);
    }
  };

  const handleFileDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => window.print();

  /* ─────────────────────────── خريطة اسم القسم ──────────────────────────── */
  const getSectionName = (url: string) => {
    if (url.includes('addSop-Definition')) return 'التعريفات';
    if (url.includes('addSop-Purpose')) return 'الغرض';
    if (url.includes('SopReponsibility-create')) return 'المسؤولية';
    if (url.includes('addSop-Procedure')) return 'الإجراءات';
    if (url.includes('addSop-Scope')) return 'مجال التطبيق';
    if (url.includes('addsop-safety-concerns')) return 'اشتراطات السلامة';
    if (url.includes('/sopRefrences/Create')) return 'الوثائق المرجعية';
    return url;
  };

  /* ───────────────────────────── إرسال النموذج ──────────────────────────── */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitLoading(true);
    try {
      const headerPayload = {
        Doc_Title_en: formData.titleEn,
        Doc_Title_ar: formData.titleAr,
        Com_Id: compId,
        Dept_Id: selectedDepartment,
        status: '1',
        doc_Type: formData.documentType,
      };

      const headerRes = await axiosServices.post('/api/sopheader/addEditSopHeader', headerPayload);
      const headerId = headerRes.data?.Id;
      if (!headerId) throw new Error('لا يوجد Header Id');

      if (!user) {
        Swal.fire('خطأ', 'بيانات المستخدم غير متوفرة', 'error');
        return;
      }
      const userId = user.Id;

      const sections = [
        {
          en: formData.definitionsEn,
          ar: formData.definitionsAr,
          url: '/api/sopDefinition/addSop-Definition',
        },
        { en: formData.purposeEn, ar: formData.purposeAr, url: '/api/soppurpose/addSop-Purpose' },
        {
          en: formData.responsibilityEn,
          ar: formData.responsibilityAr,
          url: '/api/sopRes/SopReponsibility-create',
        },
        {
          en: formData.procedureEn,
          ar: formData.procedureAr,
          url: '/api/sopProcedures/addSop-Procedure',
        },
        { en: formData.scopeEn, ar: formData.scopeAr, url: '/api/sopScope/addSop-Scope' },
        {
          en: formData.safetyConcernsEn,
          ar: formData.safetyConcernsAr,
          url: '/api/sopSafetyConcerns/addsop-safety-concerns',
        },
        {
          en: formData.referenceDocumentsEn,
          ar: formData.referenceDocumentsAr,
          url: '/api/sopRefrences/Create',
        },
        {
          en: formData.criticalPointsEn,
          ar: formData.criticalPointsAr,
          url: '/api/sopCriticalControlPoints/addSop-CriticalControlPoint',
        },
      ];

      for (const s of sections) {
        if (s.en || s.ar) {
          setSubmitStatus(`⏳ رفع قسم: ${getSectionName(s.url)}…`);
          await axiosServices.post(s.url, {
            Content_en: s.en,
            Content_ar: s.ar,
            Is_Current: 1,
            Is_Active: 1,
            Sop_HeaderId: headerId,
          });
        }
      }

      if (attachments.length) {
        setSubmitStatus('⏳ رفع المرفقات…');
        const fd = new FormData();
        attachments.forEach((f) => fd.append('files', f));
        fd.append('Sop_HeadId', headerId);
        fd.append('Crt_by', userId);
        await axiosServices.post('/api/files/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSubmitStatus('🎉 تم إنشاء الـ SOP');
      await new Promise((r) => setTimeout(r, 500));
      Swal.fire('تم', 'تم إنشاء الـ SOP بنجاح', 'success').then((r) => {
        if (r.isConfirmed) navigate(`/SOPFullDocument?headerId=${headerId}`);
      });
    } catch (err) {
      console.error(err);
      Swal.fire('خطأ', 'حدث خطأ أثناء الحفظ', 'error');
    }
  };

  /* ───────────────────────────── واجهة تحميل المستخدم ───────────────────── */
  if (!user || !compId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          جاري تحميل بيانات المستخدم…
        </Typography>
      </Box>
    );
  }

  /* ╭──────────────────────────────────────────────────────────────╮
     │ JSX                                                          │
     ╰──────────────────────────────────────────────────────────────╯ */
  return (
    <>
      {/* أرقام عربية للقوائم المرتّبة */}
      <GlobalStyles
        styles={{
          '[dir="rtl"] .note-editable ol': {
            listStyleType: 'arabic-indic',
            marginRight: '1.25rem',
          },
        }}
      />

      <Backdrop sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }} open={submitLoading}>
        <Box
          sx={{
            bgcolor: 'white',
            color: 'black',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            minWidth: 240,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {submitStatus}
          </Typography>
        </Box>
      </Backdrop>

      <Paper sx={{ p: 4, m: 2 }}>
        <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h1">CREATION SOP</Typography>
          <Typography variant="subtitle1">Standard Operating Procedure (SOP)</Typography>
        </Box>

        <Container>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* ───────────── العربية ───────────── */}
              <Grid item xs={12} md={6} sx={{ direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="h5" gutterBottom>
                  العربية
                </Typography>

                {/* نوع الوثيقة */}
                <FormControl fullWidth margin="normal" sx={{ textAlign: 'right' }}>
                  <InputLabel id="doc-type-label-ar">نوع الوثيقة</InputLabel>
                  <Select
                    labelId="doc-type-label-ar"
                    name="documentType"
                    value={formData.documentType}
                    label="نوع الوثيقة"
                    onChange={(e) => setFormData((p) => ({ ...p, documentType: e.target.value }))}
                  >
                    <MenuItem value="SOP">SOP</MenuItem>
                  </Select>
                </FormControl>

                {/* عنوان */}
                <TextField
                  fullWidth
                  label="عنوان الوثيقة:"
                  name="titleAr"
                  margin="normal"
                  value={formData.titleAr}
                  onChange={handleInputChange}
                  inputProps={{ dir: 'rtl' }}
                />

                {/* التاريخ */}
                <TextField
                  fullWidth
                  label="تاريخ الإنشاء:"
                  margin="normal"
                  value={creationDate}
                  disabled
                  inputProps={{ dir: 'rtl' }}
                />

                {/* القسم */}
                <FormControl fullWidth margin="normal" sx={{ textAlign: 'right' }}>
                  <InputLabel id="dept-label-ar">القسم</InputLabel>
                  <Select
                    labelId="dept-label-ar"
                    value={selectedDepartment}
                    label="القسم"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {loading ? (
                      <MenuItem disabled>جار التحميل…</MenuItem>
                    ) : departments.length ? (
                      departments.map((d) => (
                        <MenuItem key={d.Id} value={d.Id}>
                          {d.Dept_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>لا توجد أقسام</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
                  المحتوى
                </Typography>

                {/* الغرض */}
                <Typography variant="h4">الغرض:</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.purposeAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, purposeAr: c }))}
                />

                {/* التعريفات */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  التعريفات:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.definitionsAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, definitionsAr: c }))}
                />

                {/* مجال التطبيق */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  مجال التطبيق:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.scopeAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, scopeAr: c }))}
                />

                {/* المسؤولية */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  المسؤولية:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.responsibilityAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, responsibilityAr: c }))}
                />

                {/* اشتراطات السلامة */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  اشتراطات السلامة:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.safetyConcernsAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, safetyConcernsAr: c }))}
                />

                {/* الخطوات */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  الخطوات:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.procedureAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, procedureAr: c }))}
                />

                {/* الوثائق المرجعية */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  الوثائق المرجعية:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.referenceDocumentsAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, referenceDocumentsAr: c }))}
                />

                {/* CCP */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  نقاط التحكم الحرجة:
                </Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={formData.criticalPointsAr}
                  onChange={(c: any) => setFormData((p) => ({ ...p, criticalPointsAr: c }))}
                />

                {/* المرفقات */}
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Typography variant="subtitle1">المرفقات:</Typography>
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
                    {attachments.map((file, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleFileDelete(i)} color="error">
                            <IconTrash size={20} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={containTraining}
                      onChange={(e) => setContainTraining(e.target.checked)}
                    />
                  }
                  label="يتضمن تدريب"
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* ───────────── English ───────────── */}
              <Grid item xs={12} md={6} sx={{ direction: 'ltr' }}>
                <Typography variant="h5" gutterBottom>
                  English
                </Typography>

                {/* document type */}
                <FormControl fullWidth margin="normal">
                  <InputLabel id="doc-type-label-en">Document Type</InputLabel>
                  <Select
                    labelId="doc-type-label-en"
                    name="documentType"
                    value={formData.documentType}
                    label="Document Type"
                    onChange={(e: SelectChangeEvent) =>
                      setFormData((p) => ({ ...p, documentType: e.target.value }))
                    }
                  >
                    <MenuItem value="SOP">SOP</MenuItem>
                  </Select>
                </FormControl>

                {/* title */}
                <TextField
                  fullWidth
                  label="Title Name:"
                  name="titleEn"
                  margin="normal"
                  value={formData.titleEn}
                  onChange={handleInputChange}
                />

                {/* date */}
                <TextField
                  fullWidth
                  label="Creation Date:"
                  margin="normal"
                  value={creationDate}
                  disabled
                />

                {/* department */}
                <FormControl fullWidth margin="normal">
                  <InputLabel id="dept-label-en">Department</InputLabel>
                  <Select
                    labelId="dept-label-en"
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {loading ? (
                      <MenuItem disabled>Loading…</MenuItem>
                    ) : departments.length ? (
                      departments.map((d) => (
                        <MenuItem key={d.Id} value={d.Id}>
                          {d.Dept_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No departments</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
                  Content
                </Typography>

                {/* purpose */}
                <Typography variant="h4">Purpose:</Typography>
                <RichTextEditor
                  value={formData.purposeEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, purposeEn: c }))}
                />

                {/* definitions */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Definitions:
                </Typography>
                <RichTextEditor
                  value={formData.definitionsEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, definitionsEn: c }))}
                />

                {/* scope */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Scope:
                </Typography>
                <RichTextEditor
                  value={formData.scopeEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, scopeEn: c }))}
                />

                {/* responsibility */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Responsibility:
                </Typography>
                <RichTextEditor
                  value={formData.responsibilityEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, responsibilityEn: c }))}
                />

                {/* safety */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Safety Concerns:
                </Typography>
                <RichTextEditor
                  value={formData.safetyConcernsEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, safetyConcernsEn: c }))}
                />

                {/* procedure */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Procedure:
                </Typography>
                <RichTextEditor
                  value={formData.procedureEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, procedureEn: c }))}
                />

                {/* reference docs */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Reference Documents:
                </Typography>
                <RichTextEditor
                  value={formData.referenceDocumentsEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, referenceDocumentsEn: c }))}
                />

                {/* CCP */}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Critical Control Points:
                </Typography>
                <RichTextEditor
                  value={formData.criticalPointsEn}
                  onChange={(c: any) => setFormData((p) => ({ ...p, criticalPointsEn: c }))}
                />

                {/* attachments */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Attachments:</Typography>
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
                    {attachments.map((file, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleFileDelete(i)} color="error">
                            <IconTrash size={20} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={containTraining}
                      onChange={(e) => setContainTraining(e.target.checked)}
                    />
                  }
                  label="Contain Training"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>

            {/* أزرار */}
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

        <Box component="footer" sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Unauthorized duplication is prohibited | يمنع إعادة الطباعة لغير المختصين
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

export default NewCreation;
