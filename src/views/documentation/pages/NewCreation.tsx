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
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';

interface Department {
  Id: string;
  Dept_name: string;
}

const NewCreation: React.FC = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const user = useContext(UserContext);
  const compId = user?.compId || '';
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
  });
  const creationDate = new Date().toISOString().slice(0, 10);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const joditConfig = {
    readonly: false,
    toolbarSticky: true,
    pasteFilterStyle: false,
  };

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
        .catch((err) => {
          console.error('Error fetching departments:', err);
        })
        .finally(() => {
          setLoading(false);
        });
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
      const headerPayload = {
        Doc_Title_en: formData.titleEn,
        Doc_Title_ar: formData.titleAr,
        Com_Id: compId,
        Dept_Id: selectedDepartment,
        status: '1',
      };

      const headerResponse = await axiosServices.post(
        '/api/sopheader/addEditSopHeader',
        headerPayload,
      );
      const headerId = headerResponse.data?.Id;
      if (!headerId) {
        Swal.fire({
          title: 'خطأ',
          text: 'لم يرجع السيرفر بمعرف Header صالح',
          icon: 'error',
          confirmButtonText: 'حسناً',
        });
        return;
      }

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

      Swal.fire({
        title: 'تم الإنشاء بنجاح!',
        text: 'تم إنشاء الـ SOP بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/SOPFullDocument?headerId=${headerId}`);
        }
      });
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
      <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4">CREATION SOP</Typography>
        <Typography variant="subtitle1">Standard Operating Procedure (SOP)</Typography>
      </Box>

      <Container>
        <form id="sopForm" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* العمود العربي */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'right', direction: 'rtl' }}>
              <Typography variant="h5" gutterBottom dir="rtl">
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
              <FormControl fullWidth margin="normal" sx={{ direction: 'rtl', textAlign: 'right' }}>
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
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }} dir="rtl">
                المحتوى
              </Typography>
              {/* محرر الغرض */}
              <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                الغرض:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="purposeArEditor"
                  name="purposeAr"
                  aria-label="محرر الغرض بالعربية"
                  value={formData.purposeAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, purposeAr: newContent }))
                  }
                />
              </Box>
              {/* محرر التعريفات */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                التعريفات:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="definitionsArEditor"
                  name="definitionsAr"
                  aria-label="محرر التعريفات بالعربية"
                  value={formData.definitionsAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, definitionsAr: newContent }))
                  }
                />
              </Box>
              {/* محرر مجال التطبيق */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                مجال التطبيق:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="scopeArEditor"
                  name="scopeAr"
                  aria-label="محرر مجال التطبيق بالعربية"
                  value={formData.scopeAr}
                  config={joditConfig}
                  onBlur={(newContent) => setFormData((prev) => ({ ...prev, scopeAr: newContent }))}
                />
              </Box>
              {/* محرر المسؤولية */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                المسؤولية:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="responsibilityArEditor"
                  name="responsibilityAr"
                  aria-label="محرر المسؤولية بالعربية"
                  value={formData.responsibilityAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, responsibilityAr: newContent }))
                  }
                />
              </Box>
              {/* محرر اشتراطات السلامة */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                اشتراطات السلامة:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="safetyConcernsArEditor"
                  name="safetyConcernsAr"
                  aria-label="محرر اشتراطات السلامة بالعربية"
                  value={formData.safetyConcernsAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, safetyConcernsAr: newContent }))
                  }
                />
              </Box>
              {/* محرر الإجراءات */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                الخطوات:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="procedureArEditor"
                  name="procedureAr"
                  aria-label="محرر الإجراءات بالعربية"
                  value={formData.procedureAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, procedureAr: newContent }))
                  }
                />
              </Box>
              {/* محرر الوثائق المرجعية */}
              <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right' }}>
                الوثائق المرجعية:
              </Typography>
              <Box dir="rtl">
                <JoditEditor
                  id="referenceDocumentsArEditor"
                  name="referenceDocumentsAr"
                  aria-label="محرر الوثائق المرجعية بالعربية"
                  value={formData.referenceDocumentsAr}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, referenceDocumentsAr: newContent }))
                  }
                />
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="containTraining"
                    checked={containTraining}
                    onChange={(e) => setContainTraining(e.target.checked)}
                    inputProps={{ dir: 'rtl' }}
                  />
                }
                label="يتضمن تدريب"
                sx={{ mt: 2, direction: 'rtl', textAlign: 'right' }}
              />
              <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
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
                  <input
                    type="file"
                    name="attachments"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
                <List sx={{ direction: 'rtl', textAlign: 'right' }}>
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
                  name="selectedDepartmentEn"
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
              {/* محرر الغرض */}
              <Typography variant="subtitle2">Purpose:</Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="purposeEnEditor"
                  name="purposeEn"
                  aria-label="English Purpose Editor"
                  value={formData.purposeEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, purposeEn: newContent }))
                  }
                />
              </Box>
              {/* محرر التعريفات */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Definitions:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="definitionsEnEditor"
                  name="definitionsEn"
                  aria-label="English Definitions Editor"
                  value={formData.definitionsEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, definitionsEn: newContent }))
                  }
                />
              </Box>
              {/* محرر النطاق */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Scope:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="scopeEnEditor"
                  name="scopeEn"
                  aria-label="English Scope Editor"
                  value={formData.scopeEn}
                  config={joditConfig}
                  onBlur={(newContent) => setFormData((prev) => ({ ...prev, scopeEn: newContent }))}
                />
              </Box>
              {/* محرر المسؤولية */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Responsibility:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="responsibilityEnEditor"
                  name="responsibilityEn"
                  aria-label="English Responsibility Editor"
                  value={formData.responsibilityEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, responsibilityEn: newContent }))
                  }
                />
              </Box>
              {/* محرر اشتراطات السلامة */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Safety Concerns:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="safetyConcernsEnEditor"
                  name="safetyConcernsEn"
                  aria-label="English Safety Concerns Editor"
                  value={formData.safetyConcernsEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, safetyConcernsEn: newContent }))
                  }
                />
              </Box>
              {/* محرر الإجراءات */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Procedure:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="procedureEnEditor"
                  name="procedureEn"
                  aria-label="English Procedure Editor"
                  value={formData.procedureEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, procedureEn: newContent }))
                  }
                />
              </Box>
              {/* محرر الوثائق المرجعية */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Reference Documents:
              </Typography>
              <Box dir="ltr">
                <JoditEditor
                  id="referenceDocumentsEnEditor"
                  name="referenceDocumentsEn"
                  aria-label="English Reference Documents Editor"
                  value={formData.referenceDocumentsEn}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({ ...prev, referenceDocumentsEn: newContent }))
                  }
                />
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="containTraining"
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
                  <input
                    type="file"
                    name="attachments"
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
