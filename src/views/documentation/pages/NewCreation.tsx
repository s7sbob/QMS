// ────────────────────────────────────────────────────────────────────────────────
// src/pages/NewCreation.tsx
// آخر تحديث: 03-مايو-2025
// أضيفت إمكانيات: (1) حجم/نوع الخط، مسافة الأسطر  (2) أرقام عربية للقوائم المرقّمة
// دون تعديل أي منطق أو واجهات أخرى.
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
  GlobalStyles,        // 🆕 لجعل القوائم المرقّمة عربية
  SelectChangeEvent
} from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'


/* ╭──────────────────────────────────────────────────────────────╮
   │ إعداد شريط الأدوات: إضافة fontname, fontsize, height         │
   ╰──────────────────────────────────────────────────────────────╯ */
const commonToolbar = [
  ['style', ['style']],
  ['font', ['fontname', 'fontsize', 'bold', 'italic', 'underline', 'clear']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['height', ['height']],        // مسافة الأسطر
];

const summernoteOptionsAr = {
  height: 200,
  toolbar: commonToolbar,
  fontNames: ['Cairo', 'Amiri', 'Tahoma', 'Arial', 'Times New Roman'],
  fontSizes: [
    '8', '10', '12', '14', '16', '18', '20',
    '24', '28', '32', '36', '48'
  ],
  lineHeights: ['0.5', '1.0', '1.15', '1.5', '2.0', '3.0'],
};

const summernoteOptionsEn = {
  height: 200,
  toolbar: commonToolbar,
  fontNames: ['Arial', 'Times New Roman', 'Calibri', 'Tahoma', 'Helvetica', 'Courier New'],
  fontSizes: [
    '8', '10', '12', '14', '16', '18', '20',
    '24', '28', '32', '36', '48'
  ],
  lineHeights: ['0.5', '1.0', '1.15', '1.5', '2.0', '3.0'],
};

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
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string>('');

  const getSectionName = (url: string) => {
  if (url.includes('addSop-Definition'))   return 'التعريفات';
  if (url.includes('addSop-Purpose'))      return 'الغرض';
  if (url.includes('SopReponsibility-create')) return 'المسؤولية';
  if (url.includes('addSop-Procedure'))    return 'الإجراءات';
  if (url.includes('addSop-Scope'))        return 'مجال التطبيق';
  if (url.includes('addsop-safety-concerns')) return 'اشتراطات السلامة';
  if (url.includes('/sopRefrences/Create'))   return 'الوثائق المرجعية';
  return url;
};
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [containTraining, setContainTraining] = useState<boolean>(false);

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
        criticalPointsAr: '',             // ← Arabic
    criticalPointsEn: '',             // ← English
     documentType: 'SOP'

  });

  const creationDate = new Date().toISOString().slice(0, 10);
  const [loading, setLoading] = useState<boolean>(false);
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
            } catch (error) {
              console.error('Error parsing departments:', error);
              data = [];
            }
          }
          setDepartments(data);
        })
        .catch((err) => console.error('Error fetching departments:', err))
        .finally(() => setLoading(false));
    }
  }, [compId]);

  /* ──────────────────────────────  معالجات الإدخال ──────────────────────── */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
          Doc_Type: formData.documentType

      };

      const headerResponse = await axiosServices.post(
        '/api/sopheader/addEditSopHeader',
        headerPayload
      );
      const headerId = headerResponse.data?.Id;
      if (!headerId) throw new Error('لا يوجد Header Id');
      // 1) guard against null
      if (!user) {
        Swal.fire({
          title: 'خطأ',
          text: 'بيانات المستخدم غير متوفرة.',
          icon: 'error',
          confirmButtonText: 'حسناً',
        })
        return
      }
      const userId = user.Id   // <-- note uppercase "Id"

      setSubmitStatus('✅ Header تم إنشاؤه');

      const sections = [
        {
          en: formData.definitionsEn,
          ar: formData.definitionsAr,
          url: '/api/sopDefinition/addSop-Definition',
        },
        {
          en: formData.purposeEn,
          ar: formData.purposeAr,
          url: '/api/soppurpose/addSop-Purpose',
        },
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
        {
          en: formData.scopeEn,
          ar: formData.scopeAr,
          url: '/api/sopScope/addSop-Scope',
        },
        {
          en: formData.safetyConcernsEn,
          ar: formData.safetyConcernsAr,
          url: '/api/sopSafetyConcerns/addsop-safety-concerns',
        },
                /* ⭐ الوثائق المرجعية – NEW ⭐ */
                {
                  en: formData.referenceDocumentsEn,
                  ar: formData.referenceDocumentsAr,
                  url: '/api/sopRefrences/Create',           // مسار الـ backend الجديد
                },
                 /* ⭐ CCP – NEW */
        { en: formData.criticalPointsEn, ar: formData.criticalPointsAr, url: '/api/sopCriticalControlPoints/addSop-CriticalControlPoint'          },

      ];

      for (const sec of sections) {
        if (sec.en || sec.ar) {
          const sectionName = getSectionName(sec.url);
          setSubmitStatus(`⏳ رفع قسم: ${sectionName}...`);
          await axiosServices.post(sec.url, {
            Content_en: sec.en,
            Content_ar: sec.ar,
            Is_Current: 1,
            Is_Active: 1,
            Sop_HeaderId: headerId,
          });
          setSubmitStatus(`✅ تمت إضافة: ${sectionName}`);
        }
      }

           // ────────── NEW: upload attachments ──────────
    if (attachments.length > 0) {
        setSubmitStatus('⏳ رفع المرفقات...');
        const fd = new FormData();
        // append each file under the field name "files"
        attachments.forEach(f => fd.append('files', f))
        // inform the backend which SOP header these belong to
        fd.append('Sop_HeadId', headerId)
        // if you track who uploaded:
        fd.append('Crt_by', userId)    // ✅ safe, correct property
  
        await axiosServices.post('/api/files/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitStatus('✅ المرفقات تم رفعها');
      }
       // ─────────────────────────────────────────────


      setSubmitStatus('🎉 اكتمل إنشاء الـ SOP');
      // give the user a moment to read “done” before the alert
      await new Promise(res => setTimeout(res, 500));

      Swal.fire({
        title: 'تم الإنشاء بنجاح!',
        text: 'تم إنشاء الـ SOP بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً',
      }).then((r) => r.isConfirmed && navigate(`/SOPFullDocument?headerId=${headerId}`));
    } catch (error) {
      console.error('Error in submit:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'حدث خطأ أثناء إنشاء الـ SOP. راجع الـ Console لمعرفة التفاصيل.',
        icon: 'error',
        confirmButtonText: 'حسناً',
      });
    }
  };

  /* ───────────────────────────────ـ واجهة التحميل ───────────────────────── */
  if (!user || !compId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          جاري تحميل بيانات المستخدم...
        </Typography>
      </Box>
    );
  }

  /* ╭──────────────────────────────────────────────────────────────╮
     │ الكود JSX                                                   │
     ╰──────────────────────────────────────────────────────────────╯ */
  return (
    <>
      {/* ░░ GlobalStyles لجعل الترقيم عربي-هندي ░░ */}
      <GlobalStyles
        styles={{
          '[dir="rtl"] .note-editable ol': {
            listStyleType: 'arabic-indic',
            marginRight: '1.25rem',
          },
        }}
      />
<Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={submitLoading}
>
  <Box sx={{
    bgcolor: 'white',
    color: 'black',
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
    minWidth: 240
  }}>
    <CircularProgress />
    <Typography variant="h6" sx={{ mt: 2 }}>
      {submitStatus}
    </Typography>
  </Box>
</Backdrop>
      <Paper sx={{ p: 4, m: 2 }}>
        <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h1">CREATION SOP</Typography>
          <Typography variant="subtitle1">
            Standard Operating Procedure (SOP)
          </Typography>
        </Box>

        <Container>
          <form id="sopForm" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* ─── العربية ─────────────────────────────────────────────── */}
              <Grid item xs={12} md={6} sx={{ textAlign: 'right', direction: 'rtl' }}>
                <Typography variant="h5" gutterBottom dir="rtl">
                  العربية
                </Typography>
                <FormControl
  fullWidth
  margin="normal"
  sx={{ direction: 'rtl', textAlign: 'right' }}
>
  <InputLabel id="doc-type-label-ar" dir="rtl">
    نوع الوثيقة
  </InputLabel>
  <Select
    labelId="doc-type-label-ar"
    id="documentType"
    name="documentType"
    value={formData.documentType}
    label="نوع الوثيقة"
    onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
    sx={{ direction: 'rtl', textAlign: 'right' }}
  >
    <MenuItem value="SOP">SOP</MenuItem>
    {/* later you can add more: <MenuItem value="XYZ">XYZ</MenuItem> */}
  </Select>
</FormControl>

                <TextField
                  fullWidth
                  label="عنوان الوثيقة:"
                  id="titleAr"
                  name="titleAr"
                  variant="outlined"
                  margin="normal"
                  value={formData.titleAr}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  inputProps={{ dir: 'rtl' }}
                  InputLabelProps={{ style: { direction: 'rtl' } }}
                />

                <TextField
                  fullWidth
                  label="تاريخ الإنشاء:"
                  id="creationDateAr"
                  name="creationDateAr"
                  variant="outlined"
                  margin="normal"
                  value={creationDate}
                  disabled
                  inputProps={{ dir: 'rtl' }}
                  InputLabelProps={{ style: { direction: 'rtl' } }}
                />

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ direction: 'rtl', textAlign: 'right' }}
                >
                  <InputLabel id="dept-label" dir="rtl" sx={{ direction: 'rtl' }}>
                    القسم
                  </InputLabel>
                  <Select
                    labelId="dept-label"
                    id="selectedDepartment"
                    name="selectedDepartment"
                    value={selectedDepartment}
                    label="القسم"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    sx={{ direction: 'rtl', textAlign: 'right' }}
                  >
                    {loading ? (
                      <MenuItem disabled>
                        <em>جار التحميل...</em>
                      </MenuItem>
                    ) : departments.length > 0 ? (
                      departments.map((dept) => (
                        <MenuItem key={dept.Id} value={dept.Id}>
                          {dept.Dept_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>لا توجد أقسام</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Typography variant="h4" gutterBottom sx={{ mt: 3 }} dir="rtl">
                  المحتوى
                </Typography>

                {/* الغرض */}
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'right' }}>
                  الغرض:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.purposeAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, purposeAr: content }))
                  }
                  />
                </Box>

                {/* التعريفات */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  التعريفات:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.definitionsAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, definitionsAr: content }))
                  }
                  />
                </Box>

                {/* مجال التطبيق */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  مجال التطبيق:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.scopeAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, scopeAr: content }))
                  }
                  />
                </Box>

                {/* المسؤولية */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  المسؤولية:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.responsibilityAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, responsibilityAr: content }))
                  }
                  />
                </Box>

                {/* اشتراطات السلامة */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  اشتراطات السلامة:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.safetyConcernsAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, safetyConcernsAr: content }))
                  }
                  />
                </Box>

                {/* الإجراءات */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  الخطوات:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.procedureAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, procedureAr: content }))
                  }
                  />
                </Box>

                {/* الوثائق المرجعية */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'right' }}>
                  الوثائق المرجعية:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                  value={formData.referenceDocumentsAr}
                  options={summernoteOptionsAr}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, referenceDocumentsAr: content }))
                  }
                  />
                </Box>

                 {/* ⭐ CCP – NEW (العربية) */}
                <Typography variant="h4" gutterBottom sx={{ mt:2, textAlign:'right' }}>
                  نقاط التحكم الحرجة:
                </Typography>
                <Box dir="rtl">
                  <ReactSummernote
                    value={formData.criticalPointsAr}
                    options={summernoteOptionsAr}
                    onChange={(c:string)=>
                      setFormData(prev=>({...prev, criticalPointsAr:c}))}
                  />
                </Box>

                {/* المرفقات */}
                <Box sx={{ direction: 'rtl', textAlign: 'right', mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom dir="rtl">
                    المرفقات:
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
                  <List sx={{ direction: 'rtl', textAlign: 'right' }}>
                    {attachments.map((file, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleFileDelete(idx)}
                            color="error"
                          >
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
                  sx={{ mt: 2, direction: 'rtl', textAlign: 'right' }}
                />
              </Grid>

              {/* ─── English ─────────────────────────────────────────────── */}
              <Grid item xs={12} md={6} sx={{ textAlign: 'left', direction: 'ltr' }}>
                <Typography variant="h5" gutterBottom>
                  English
                </Typography>
<FormControl fullWidth margin="normal">
  <InputLabel id="doc-type-label-en">
    Document Type
  </InputLabel>
  <Select
    labelId="doc-type-label-en"
    id="documentTypeEn"
    name="documentType"
    value={formData.documentType}
    label="Document Type"
    onChange={(event: SelectChangeEvent<string>) =>
      setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }
  >
    <MenuItem value="SOP">SOP</MenuItem>
  </Select>
</FormControl>
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
                  label="Creation Date:"
                  id="creationDateEn"
                  name="creationDateEn"
                  variant="outlined"
                  margin="normal"
                  value={creationDate}
                  disabled
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="dept-label-en">Department</InputLabel>
                  <Select
                    labelId="dept-label-en"
                    id="selectedDepartmentEn"
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {loading ? (
                      <MenuItem disabled>
                        <em>جار التحميل...</em>
                      </MenuItem>
                    ) : departments.length > 0 ? (
                      departments.map((dept) => (
                        <MenuItem key={dept.Id} value={dept.Id}>
                          {dept.Dept_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No departments</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
                  Content
                </Typography>

                {/* Purpose */}
                <Typography variant="h4" gutterBottom>Purpose:</Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.purposeEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, purposeEn: content }))
                  }
                  />
                </Box>

                {/* Definitions */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Definitions:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.definitionsEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, definitionsEn: content }))
                  }
                  />
                </Box>

                {/* Scope */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Scope:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.scopeEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, scopeEn: content }))
                  }
                  />
                </Box>

                {/* Responsibility */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Responsibility:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.responsibilityEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, responsibilityEn: content }))
                  }
                  />
                </Box>

                {/* Safety Concerns */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Safety Concerns:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.safetyConcernsEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, safetyConcernsEn: content }))
                  }
                  />
                </Box>

                {/* Procedure */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Procedure:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.procedureEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, procedureEn: content }))
                  }
                  />
                </Box>

                {/* Reference Documents */}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                  Reference Documents:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                  value={formData.referenceDocumentsEn}
                  options={summernoteOptionsEn}
                  onChange={(content: string) =>
                    setFormData((prev: typeof formData) => ({ ...prev, referenceDocumentsEn: content }))
                  }
                  />
                </Box>
                 {/* ⭐ CCP – NEW (English) */}
                <Typography variant="h4" gutterBottom sx={{ mt:2 }}>
                  Critical Control Points:
                </Typography>
                <Box dir="ltr">
                  <ReactSummernote
                    value={formData.criticalPointsEn}
                    options={summernoteOptionsEn}
                    onChange={(c:string)=>
                      setFormData(prev=>({...prev, criticalPointsEn:c}))}
                  />
                </Box>

                {/* Attachments */}
                <Box sx={{ mt: 2 }}>
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
                    {attachments.map((file, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleFileDelete(idx)}
                            color="error"
                          >
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

            {/* أزرار الإجراء */}
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
