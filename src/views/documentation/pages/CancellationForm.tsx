// src/pages/CancellationForm.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';

// 1) استيراد محرر Summernote
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';

// تعريف واجهة البيانات
interface FormData {
  date: string;
  requestedSection: string; // departmentId
  requestedById: string;    // سنرسل الـuserId إلى الباك إند
  requestedByName: string;  // عرض فقط
  sectionManagerId: string; // معرف المدير
  sectionManagerName: string; // اسم المدير للعرض فقط

  documentTitle: string;   // sopId
  documentCode: string;
  revision: string;
  issueDate: string;
  reasons: string[];
  changeReason: string;        // محتوى محرر Summernote
  changeDescription: string;   // محتوى محرر Summernote
  suggestedDate: string;
  qualityManagerDecision: string; // محتوى محرر Summernote
}

// دالة لجلب تاريخ اليوم بتنسيق YYYY-MM-DD
const getToday = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// الحالة المبدئية
const initialData: FormData = {
  date: '',
  requestedSection: '',
  requestedById: '',
  requestedByName: '',
  sectionManagerId: '',
  sectionManagerName: '',

  documentTitle: '',
  documentCode: '',
  revision: '',
  issueDate: getToday(),
  reasons: [],
  changeReason: '',
  changeDescription: '',
  suggestedDate: '',
  qualityManagerDecision: '',
};

// خيارات خانات الـCheckbox
const reasonsOptions = [
  'Periodic review',
  'Updating of procedure',
  'Audit response',
  'Add/Remove form',
  'Regulation Request',
  'Merged with another document',
  'Other',
];

// بنية القسم
interface IDepartment {
  Id: string;
  Dept_name: string;
  Dept_manager: string | null;        // يحتوي على معرف المدير
  Dept_manager_name?: string | null;  // اسم المدير (إن وجد)
}

// بنية الـSOP
interface ISopHeader {
  Id: string;
  Dept_Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
}

// إعدادات الـToolbar للـSummernote (نفس ما في NewCreation أو قريبة منه)
const summernoteOptions = {
  height: 200,
  toolbar: [
    ['style', ['style']],
    ['font', ['bold', 'italic', 'underline', 'clear']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['table', ['table']],
  ],
};

const CancellationForm: React.FC = () => {
  const user = useContext(UserContext);

  const [formData, setFormData] = useState<FormData>(initialData);

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [allSopHeaders, setAllSopHeaders] = useState<ISopHeader[]>([]);
  const [filteredSopHeaders, setFilteredSopHeaders] = useState<ISopHeader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // عند التحميل أو تغيّر user
  useEffect(() => {
    // تعبئة حقل Requested By بناءً على user
    if (user) {
      const fullName = `${user.FName} ${user.LName}`;
      setFormData((prev) => ({
        ...prev,
        requestedById: user.Id,
        requestedByName: fullName,
      }));
    }

    // لو موجود أقسام في userContext
    if (user?.Users_Departments_Users_Departments_User_IdToUser_Data) {
      const userDepartments = user.Users_Departments_Users_Departments_User_IdToUser_Data.map(
        (ud: any) => ({
          Id: ud.Department_Data?.Id,
          Dept_name: ud.Department_Data?.Dept_name,
          Dept_manager: ud.Department_Data?.Dept_manager,
          Dept_manager_name: ud.Department_Data?.Dept_manager_name || null,
        })
      );
      setDepartments(userDepartments);
    }
  }, [user]);

  // جلب جميع الـSOPs
  useEffect(() => {
    const fetchAllSopHeaders = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get('/api/sopheader/getAllSopHeaders');
        setAllSopHeaders(response.data);
      } catch (error) {
        console.error('خطأ في جلب الـSOPs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSopHeaders();
  }, []);

  // التعامل مع الحقول العادية
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // التعامل مع خانات الـCheckbox
  const handleCheckboxChange = (reason: string) => {
    setFormData((prev) => {
      const currentReasons = prev.reasons;
      if (currentReasons.includes(reason)) {
        return {
          ...prev,
          reasons: currentReasons.filter((r) => r !== reason),
        };
      } else {
        return { ...prev, reasons: [...currentReasons, reason] };
      }
    });
  };

  // عند اختيار القسم
  const handleSelectDepartment = (event: SelectChangeEvent<string>) => {
    const selectedDeptId = event.target.value;
    const selectedDept = departments.find((dpt) => dpt.Id === selectedDeptId);

    // فلترة الـSOP الخاصة بهذا القسم
    const sopsForDept = allSopHeaders.filter((sop) => sop.Dept_Id === selectedDeptId);
    setFilteredSopHeaders(sopsForDept);

    // تعبئة بيانات القسم (مديره)
    setFormData((prev) => ({
      ...prev,
      requestedSection: selectedDeptId,
      documentTitle: '',
      documentCode: '',
      sectionManagerId: selectedDept?.Dept_manager || '',
      sectionManagerName: selectedDept?.Dept_manager_name || '',
    }));
  };

  // عند اختيار SOP
  const handleSelectSop = (event: SelectChangeEvent<string>) => {
    const selectedSopId = event.target.value;
    const selectedSop = filteredSopHeaders.find((sop) => sop.Id === selectedSopId);

    setFormData((prev) => ({
      ...prev,
      documentTitle: selectedSopId,
      documentCode: selectedSop ? selectedSop.Doc_Code : '',
    }));
  };

  // هل المستخدم الحالي QA Manager؟
  const isQaManager = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name === 'QA Manager';

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" mt={2} color="primary">
          Loading data...
        </Typography>
      </Box>
    );
  }

  // إرسال البيانات
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // جهّز الحزمة (payload)
      const payload = {
        ...formData,
      };
      const response = await axiosServices.post('/api/cancelForm/addEditCancel-form', payload);
      console.log('تم الإرسال بنجاح:', response.data);
      alert('تم إرسال طلب التغيير/الإلغاء بنجاح!');
      // reset
      setFormData(initialData);
      setFilteredSopHeaders([]);
    } catch (error) {
      console.error('خطأ أثناء الإرسال:', error);
      alert('حدث خطأ أثناء إرسال الطلب.');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Change / Cancellation Request
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>

            {/* Requested Section (Department) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="department-label">Requested Section</InputLabel>
                <Select
                  labelId="department-label"
                  id="department-select"
                  name="requestedSection"
                  value={formData.requestedSection}
                  label="Requested Section"
                  onChange={handleSelectDepartment}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.Id} value={dept.Id}>
                      {dept.Dept_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Document Title (SOP) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="sop-label">Document Title</InputLabel>
                <Select
                  labelId="sop-label"
                  id="sop-select"
                  name="documentTitle"
                  value={formData.documentTitle}
                  label="Document Title"
                  onChange={handleSelectSop}
                  disabled={!formData.requestedSection}
                >
                  {filteredSopHeaders.map((sop) => (
                    <MenuItem key={sop.Id} value={sop.Id}>
                      {sop.Doc_Title_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Document Code# */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Code#"
                name="documentCode"
                value={formData.documentCode}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* Requested By (Name) - عرض فقط */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Requested By (Name)"
                name="requestedByName"
                value={formData.requestedByName}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* Section Manager (Name) - عرض فقط */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section Manager (Name)"
                name="sectionManagerName"
                value={formData.sectionManagerName}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* Current Revision # */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Current Revision #"
                name="revision"
                value={formData.revision}
                onChange={handleChange}
              />
            </Grid>

            {/* Current Issue Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Current Issue Date"
                name="issueDate"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={handleChange}
              />
            </Grid>

            {/* Reasons (Checkbox) */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Reason for Change/Cancellation:
              </Typography>
              <FormGroup row>
                {reasonsOptions.map((reason) => (
                  <FormControlLabel
                    key={reason}
                    control={
                      <Checkbox
                        checked={formData.reasons.includes(reason)}
                        onChange={() => handleCheckboxChange(reason)}
                      />
                    }
                    label={reason}
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Change / Cancellation Reason (باستخدام محرر Summernote) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Change / Cancellation Reason
              </Typography>
              <ReactSummernote
                value={formData.changeReason}
                options={summernoteOptions}
                onChange={(content: string) =>
                  setFormData((prev) => ({ ...prev, changeReason: content }))
                }
              />
            </Grid>

            {/* Description of Change (باستخدام محرر Summernote) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Description of Change
              </Typography>
              <ReactSummernote
                value={formData.changeDescription}
                options={summernoteOptions}
                onChange={(content: string) =>
                  setFormData((prev) => ({ ...prev, changeDescription: content }))
                }
              />
            </Grid>

            {/* Suggested Date of Applying Changes */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Suggested Date of Applying Changes"
                name="suggestedDate"
                InputLabelProps={{ shrink: true }}
                value={formData.suggestedDate}
                onChange={handleChange}
              />
            </Grid>

            {/* Quality Assurance Manager Decision */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Quality Assurance Manager Decision
              </Typography>
              {/* إذا كان المستخدم QA Manager نعرض محرر Summernote، وإلا نعرض النص بشكل عادي */}
              {isQaManager ? (
                <ReactSummernote
                  value={formData.qualityManagerDecision}
                  options={summernoteOptions}
                  onChange={(content: string) =>
                    setFormData((prev) => ({ ...prev, qualityManagerDecision: content }))
                  }
                />
              ) : (
                <Box
                  sx={{
                    minHeight: 100,
                    p: 2,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    backgroundColor: '#f9f9f9',
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.qualityManagerDecision }}
                />
              )}
            </Grid>
          </Grid>

          {/* زر الإرسال */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CancellationForm;
