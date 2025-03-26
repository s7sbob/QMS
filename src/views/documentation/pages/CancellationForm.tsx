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
} from '@mui/material';

import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';

interface FormData {
  date: string;
  requestedSection: string; // سيُخزَّن فيها departmentId
  documentTitle: string;
  documentCode: string;
  revision: string;
  issueDate: string;
  reasons: string[];
  changeReason: string;
  changeDescription: string;
  suggestedDate: string;
  requestedByName: string;
  sectionManagerName: string;
  qualityManagerDecision: string;
}

const initialData: FormData = {
  date: '',
  requestedSection: '',
  documentTitle: '',
  documentCode: '',
  revision: '',
  issueDate: '',
  reasons: [],
  changeReason: '',
  changeDescription: '',
  suggestedDate: '',
  requestedByName: '',
  sectionManagerName: '',
  qualityManagerDecision: '',
};

// المصفوفة الخاصة بخانات الـCheckbox
const reasonsOptions = [
  'Periodic review',
  'Updating of procedure',
  'Audit response',
  'Add/Remove form',
  'Regulation Request',
  'Merged with another document',
  'Other',
];

// نوع بيانات القسم المراد عرضه في القائمة المنسدلة
interface IDepartment {
  Id: string;
  Dept_name: string;
}

const CancellationForm: React.FC = () => {
  // جلب بيانات المستخدم من الـContext
  const user = useContext(UserContext);

  // بيانات النموذج
  const [formData, setFormData] = useState<FormData>(initialData);

  // الأقسام الخاصة بالمستخدم (بدلًا من استدعاء API)
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  // عند تغيّر بيانات user، نستخرج الأقسام من الحقل Users_Departments_Users_Departments_User_IdToUser_Data
  useEffect(() => {
    if (user?.Users_Departments_Users_Departments_User_IdToUser_Data) {
      // نفترض أن الحقل Department_Data يحوي { Id, Dept_name }
      const userDepartments = user.Users_Departments_Users_Departments_User_IdToUser_Data.map(
        (ud: any) => ({
          Id: ud.Department_Data?.Id,
          Dept_name: ud.Department_Data?.Dept_name,
        })
      );
      setDepartments(userDepartments);
    }
  }, [user]);

  // التعديل على الحقول النصية
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // التعديل على خانات الـCheckbox
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

  // عند اختيار قسم من الـSelect
  const handleSelectDepartment = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      requestedSection: event.target.value,
    }));
  };

  // إرسال البيانات إلى الباك إند
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosServices.post(
        '/api/cancelForm/addEditCancel-form',
        formData
      );
      console.log('تم الإرسال بنجاح:', response.data);
      alert('تم إرسال طلب التغيير/الإلغاء بنجاح!');
      setFormData(initialData);
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

            {/* جعل Requested Section قائمة منسدلة */}
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

            {/* باقي الحقول */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Title"
                name="documentTitle"
                value={formData.documentTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Code#"
                name="documentCode"
                value={formData.documentCode}
                onChange={handleChange}
              />
            </Grid>
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
                        name="reason"
                        value={reason}
                      />
                    }
                    label={reason}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Change / Cancellation Reason"
                name="changeReason"
                multiline
                rows={3}
                value={formData.changeReason}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Description of Change"
                name="changeDescription"
                multiline
                rows={3}
                value={formData.changeDescription}
                onChange={handleChange}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Requested By (Name)"
                name="requestedByName"
                value={formData.requestedByName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Section Manager (Name)"
                name="sectionManagerName"
                value={formData.sectionManagerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Quality Assurance Manager Decision"
                name="qualityManagerDecision"
                multiline
                rows={3}
                value={formData.qualityManagerDecision}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

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
