// src/pages/NewCreation.tsx
import React, { useState, useEffect, useContext } from 'react';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';

interface Department {
  Id: string;
  Dept_name: string;
  // يمكنك إضافة خصائص أخرى إذا احتجت
}

const NewCreation: React.FC = () => {
  // State للملفات المرفقة
  const [attachments, setAttachments] = useState<File[]>([]);

  // الحصول على بيانات المستخدم من الـ UserContext
  const user = useContext(UserContext);
  // نستخرج compId من بيانات المستخدم
  const compId = user?.compId || '';

  // state لتخزين الأقسام بناءً على compId
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // state للcheckbox "contain training"
  const [containTraining, setContainTraining] = useState<boolean>(false);

  // state للحقول النصية (العناوين والمحتوى)
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
  });

  // عرض تاريخ الإنشاء (محسوب من النظام)
  const creationDate = new Date().toISOString().slice(0, 10);

  // حالة مؤشر التحميل
  const [loading, setLoading] = useState<boolean>(false);

  // جلب الأقسام بناءً على compId
  useEffect(() => {
    if (compId) {
      console.log('Using compId:', compId);
      setLoading(true);
      axiosServices
        .get(`/api/department/compdepartments/${compId}`)
        .then((res) => {
          console.log('Response from departments API:', res.data);
          let data = res.data;
          if (!Array.isArray(data)) {
            try {
              data = JSON.parse(data);
            } catch (error) {
              console.error('Error parsing departments:', error);
              data = [];
            }
          }
          console.log('Parsed departments:', data);
          setDepartments(data);
        })
        .catch((err) => {
          console.error('Error fetching departments:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('compId not available yet');
    }
  }, [compId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // إرسال بيانات الـ Header المطلوبة فقط: Doc_Title_en, Doc_Title_ar, Com_Id, Dept_Id
      const headerPayload = {
        Doc_Title_en: formData.titleEn,
        Doc_Title_ar: formData.titleAr,
        Com_Id: compId,
        Dept_Id: selectedDepartment,
      };

      const headerResponse = await axiosServices.post(
        '/api/sopheader/addEditSopHeader',
        headerPayload,
      );
      const headerId = headerResponse.data?.Id;
      if (!headerId) {
        alert('لم يرجع السيرفر بمعرف Header صالح');
        return;
      }

      // باقي استدعاءات API الخاصة بالمحتوى (مثلاً Definitions, Purpose, ...)
      if (formData.definitionsEn || formData.definitionsAr) {
        const defPayload = {
          Content_en: formData.definitionsEn,
          Content_ar: formData.definitionsAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopDefinition/addSop-Definition', defPayload);
      }

      if (formData.purposeEn || formData.purposeAr) {
        const purposePayload = {
          Content_en: formData.purposeEn,
          Content_ar: formData.purposeAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/soppurpose/addSop-Purpose', purposePayload);
      }

      if (formData.responsibilityEn || formData.responsibilityAr) {
        const resPayload = {
          Content_en: formData.responsibilityEn,
          Content_ar: formData.responsibilityAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopRes/SopReponsibility-create', resPayload);
      }

      if (formData.procedureEn || formData.procedureAr) {
        const procPayload = {
          Content_en: formData.procedureEn,
          Content_ar: formData.procedureAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopProcedures/addSop-Procedure', procPayload);
      }

      if (formData.scopeEn || formData.scopeAr) {
        const scopePayload = {
          Content_en: formData.scopeEn,
          Content_ar: formData.scopeAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopScope/addSop-Scope', scopePayload);
      }

      if (formData.safetyConcernsEn || formData.safetyConcernsAr) {
        const safetyPayload = {
          Content_en: formData.safetyConcernsEn,
          Content_ar: formData.safetyConcernsAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        };
        await axiosServices.post('/api/sopSafetyConcerns/addsop-safety-concerns', safetyPayload);
      }

      alert('تم إنشاء الـ SOP بنجاح وإرسال كل جزء للـ Endpoint الخاص به.');
    } catch (error) {
      console.error('Error in submit:', error);
      alert('حدث خطأ أثناء إنشاء الـ SOP. راجع الـ Console لمعرفة التفاصيل.');
    }
  };

  // إذا لم يتوفر user أو compId بعد، نعرض مؤشر تحميل
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
                label="تاريخ الإنشاء:"
                id="creationDateAr"
                name="creationDateAr"
                variant="outlined"
                margin="normal"
                value={creationDate}
                disabled
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="dept-label">القسم</InputLabel>
                <Select
                  labelId="dept-label"
                  id="selectedDepartment"
                  value={selectedDepartment}
                  label="القسم"
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
                      <em>لا توجد أقسام</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
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
                      <em>لا توجد أقسام</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
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
  );
};

export default NewCreation;
