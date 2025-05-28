// src/pages/NewDocumentRequestForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Stack,
  FormControlLabel,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axiosServices from 'src/utils/axiosServices';
import { SopHeaderInput } from './types/sopHeader';

interface RequestedBy {
  name: string;
  designation: string;
  signature: string;
  date: string;
}

interface FormState {
  Id?: string | null;
  requestedCode: string;
  department: string;
  date: string;               // Issued_Date
  effectiveDate: string;      // Effective_Date
  docTitle: string;           // Doc_Title_en
  docTitleAr: string;         // Doc_Title_ar
  purpose: string;            // sop_purpose (not in header API)
  scope: string;              // Sop_Scope (not in header API)
  requested: RequestedBy;
  reviewed: RequestedBy;
  qaComment: string;          // NOTES
  docType: string;            // doc_Type
  status: string;             // status code
  deptCode: string;           // dept_code
  isActive: boolean;          // Is_Active
  mergeExisting: boolean;
  mergeCode: string;          // use as Id if merging
  qaNew: boolean;             // not in header API
  qaNewCode: string;          // not in header API
  qaManager: RequestedBy;
  docOfficer: RequestedBy;
}

const initialState: FormState = {
  requestedCode: '',
  department: '',
  date: '',
  effectiveDate: '',
  docTitle: '',
  docTitleAr: '',
  purpose: '',
  scope: '',
  requested: { name: '', designation: '', signature: '', date: '' },
  reviewed: { name: '', designation: '', signature: '', date: '' },
  qaComment: '',
  docType: '',
  status: '',
  deptCode: '',
  isActive: true,
  mergeExisting: false,
  mergeCode: '',
  qaNew: false,
  qaNewCode: '',
  qaManager: { name: '', designation: '', signature: '', date: '' },
  docOfficer: { name: '', designation: '', signature: '', date: '' },
};

const NewDocumentRequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleNested =
    (parent: 'requested' | 'reviewed' | 'qaManager' | 'docOfficer', key: keyof RequestedBy) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: e.target.value },
      }));

  // جلب البيانات إذا في وضع تعديل
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosServices
      .get(`/getSopHeaderById/${id}`)
      .then((res: { data: any; }) => {
        const data = res.data;
        setForm((prev) => ({
          ...prev,
          Id: data.Id,
          requestedCode: data.Doc_Code || '',
          department: data.Dept_Id || '',
          date: data.Issued_Date?.split('T')[0] || '',
          effectiveDate: data.Effective_Date?.split('T')[0] || '',
          docTitle: data.Doc_Title_en || '',
          docTitleAr: data.Doc_Title_ar || '',
          qaComment: data.NOTES || '',
          docType: data.doc_Type || '',
          status: data.status || '',
          deptCode: data.dept_code || '',
          isActive: data.Is_Active === 1,
          // purpose, scope, nested fields can be fetched via separate endpoints if needed
        }));
      })
      .catch((err: any) => {
        console.error(err);
        alert('فشل في جلب بيانات المستند');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // بناء الحزمة للإرسال
  const buildPayload = (): SopHeaderInput => ({
    Id: form.mergeExisting ? form.mergeCode : form.Id || null,
    Doc_Code: form.requestedCode || null,
    Doc_Title_en: form.docTitle,
    Doc_Title_ar: form.docTitleAr || null,
    Dept_Id: form.department || null,
    Issued_Date: form.date ? new Date(form.date) : null,
    Effective_Date: form.effectiveDate ? new Date(form.effectiveDate) : null,
    status: form.status || null,
    NOTES: form.qaComment || null,
    doc_Type: form.docType || null,
    dept_code: form.deptCode || null,
    Is_Active: form.isActive ? 1 : 0,
    // Com_Id and Prepared_By and Crt_By handled server-side
  });

  // معالجة الإرسال
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = buildPayload();
      await axiosServices.post('/addEditSopHeader', payload);
      alert(`تم ${id ? 'تحديث' : 'إنشاء'} المستند بنجاح!`);
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء الإرسال: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4">
              {id ? 'تعديل طلب مستند' : 'إنشاء طلب مستند جديد'}
            </Typography>
          </Box>

          {/* ـــ بيانات الرأس */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                label="Requested Code"
                value={form.requestedCode}
                onChange={handleChange('requestedCode')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Department (Dept_Id)"
                value={form.department}
                onChange={handleChange('department')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Issued Date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={handleChange('date')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Effective Date"
                InputLabelProps={{ shrink: true }}
                value={form.effectiveDate}
                onChange={handleChange('effectiveDate')}
              />
            </Grid>
          </Grid>

          {/* ـــ عنوان المستند */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Title (EN)"
                value={form.docTitle}
                onChange={handleChange('docTitle')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Title (AR)"
                value={form.docTitleAr}
                onChange={handleChange('docTitleAr')}
              />
            </Grid>
          </Grid>

          {/* ـــ Purpose & Scope */}
          <Typography fontWeight="bold">Purpose:</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={form.purpose}
            onChange={handleChange('purpose')}
            sx={{ mb: 2 }}
          />
          <Typography fontWeight="bold">Scope:</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={form.scope}
            onChange={handleChange('scope')}
            sx={{ mb: 2 }}
          />

          {/* ـــ جدول Requested & Reviewed */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    Requested By
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    Reviewed By
                  </TableCell>
                </TableRow>
                {['Name', 'Designation', 'Signature', 'Date'].map((label) => (
                  <TableRow key={label}>
                    <TableCell colSpan={2}>
                      <TextField
                        fullWidth
                        label={label}
                        value={(form.requested as any)[label.toLowerCase()]}
                        onChange={handleNested('requested', label.toLowerCase() as any)}
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <TextField
                        fullWidth
                        label={label === 'Designation' ? `${label} / Dept Manager` : label}
                        value={(form.reviewed as any)[label.toLowerCase()]}
                        onChange={handleNested('reviewed', label.toLowerCase() as any)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ـــ QA Manager Comments & Doc Type */}
          <Typography fontWeight="bold">QA Manager: Comment / Decision</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={form.qaComment}
            onChange={handleChange('qaComment')}
            sx={{ mb: 2 }}
          />
          <Typography fontWeight="bold">Type of Document</Typography>
          <TextField
            fullWidth
            value={form.docType}
            onChange={handleChange('docType')}
            sx={{ mb: 2 }}
          />

          {/* ـــ حقول API إضافية */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Status Code"
                value={form.status}
                onChange={handleChange('status')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Dept Code"
                value={form.deptCode}
                onChange={handleChange('deptCode')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isActive}
                    onChange={handleCheckbox('isActive')}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>

          {/* ـــ Merge / New */}
          <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">
            <Checkbox
              checked={form.mergeExisting}
              onChange={handleCheckbox('mergeExisting')}
            />
            <Typography>Merge with existing (enter Id)</Typography>
            <TextField
              size="small"
              value={form.mergeCode}
              onChange={handleChange('mergeCode')}
            />
            <Checkbox
              checked={form.qaNew}
              onChange={handleCheckbox('qaNew')}
            />
            <Typography>New</Typography>
          </Box>

          {/* ـــ QA Document Officer Approval */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    QA Manager Approval
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    QA Document Officer
                  </TableCell>
                </TableRow>
                {['Name', 'Signature', 'Date'].map((label) => (
                  <TableRow key={label}>
                    <TableCell>
                      <TextField
                        fullWidth
                        label={label}
                        value={(form.qaManager as any)[label.toLowerCase()]}
                        onChange={handleNested('qaManager', label.toLowerCase() as any)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        label={label}
                        value={(form.docOfficer as any)[label.toLowerCase()]}
                        onChange={handleNested('docOfficer', label.toLowerCase() as any)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ـــ أزرار الإرسال */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setForm(initialState)}
              disabled={loading}
            >
              إعادة تعيين
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'جاري المعالجة...' : id ? 'حفظ التعديلات' : 'إنشاء المستند'}
            </Button>
          </Stack>
        </Paper>
      </form>
    </Container>
  );
};

export default NewDocumentRequestForm;
