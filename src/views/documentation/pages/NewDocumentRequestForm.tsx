// src/pages/NewDocumentRequestForm.tsx
import React, { useState, useEffect, useContext } from 'react';
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
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axiosServices from 'src/utils/axiosServices';
import { SopHeaderInput } from './types/sopHeader';
import RichTextEditor from './components/RichTextEditor';
import { UserContext, IUser } from 'src/context/UserContext';
import Swal from 'sweetalert2';

interface RequestedBy {
  name: string;
  designation: string;
  signature: string;
  date: string;
}

interface Department {
  Id: string;
  Dept_name: string;
}

interface FormState {
  Id?: string | null;
  department: string;
  docTitle: string;           // Doc_Title_en
  docTitleAr: string;         // Doc_Title_ar
  purposeEn: string;          // sop_purpose English
  purposeAr: string;          // sop_purpose Arabic
  scopeEn: string;            // Sop_Scope English
  scopeAr: string;            // Sop_Scope Arabic
  requested: RequestedBy;
  reviewed: RequestedBy;
  qaComment: string;          // NOTES - now rich text
  docType: string;            // doc_Type
  qaManager: RequestedBy;
  docOfficer: RequestedBy;
}

const initialState: FormState = {
  department: '',
  docTitle: '',
  docTitleAr: '',
  purposeEn: '',
  purposeAr: '',
  scopeEn: '',
  scopeAr: '',
  requested: { name: '', designation: '', signature: '', date: '' },
  reviewed: { name: '', designation: '', signature: '', date: '' },
  qaComment: '',
  docType: '',
  qaManager: { name: '', designation: '', signature: '', date: '' },
  docOfficer: { name: '', designation: '', signature: '', date: '' },
};

const NewDocumentRequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useContext<IUser | null>(UserContext);
  const compId = user?.compId || '';

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);

  // Auto-fill user data when component loads
  useEffect(() => {
    if (user) {
      const currentDate = new Date().toISOString().split('T')[0];
      setForm(prev => ({
        ...prev,
        requested: {
          name: user.name || '',
          designation: user.designation || '',
          signature: user.signature || '',
          date: currentDate,
        },
        reviewed: {
          name: user.managerName || '',
          designation: 'Department Manager',
          signature: user.managerSignature || '',
          date: currentDate,
        },
        qaManager: {
          name: user.qaManagerName || '',
          designation: 'QA Manager',
          signature: user.qaManagerSignature || '',
          date: currentDate,
        },
        docOfficer: {
          name: user.docOfficerName || '',
          designation: 'Document Officer',
          signature: user.docOfficerSignature || '',
          date: currentDate,
        },
      }));
    }
  }, [user]);

  // load departments for dropdown
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

  // if editing, fetch existing header
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosServices
      .get(`/getSopHeaderById/${id}`)
      .then(res => {
        const data = res.data;
        setForm(prev => ({
          ...prev,
          Id: data.Id,
          department: data.Dept_Id || '',
          docTitle: data.Doc_Title_en || '',
          docTitleAr: data.Doc_Title_ar || '',
          purposeEn: data.sop_purpose_en || '',
          purposeAr: data.sop_purpose_ar || '',
          scopeEn: data.Sop_Scope_en || '',
          scopeAr: data.Sop_Scope_ar || '',
          qaComment: data.NOTES || '',
          docType: data.doc_Type || '',
        }));
      })
      .catch(err => {
        console.error(err);
        Swal.fire('خطأ', 'فشل في جلب بيانات المستند', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const buildSopHeaderPayload = (): SopHeaderInput => ({
    Id: form.Id || null,
    Doc_Title_en: form.docTitle,
    Doc_Title_ar: form.docTitleAr || null,
    Dept_Id: form.department || null,
    NOTES: form.qaComment || null,
    doc_Type: form.docType || null,
  });

  const buildDocRequestPayload = () => ({
    sop_HeaderId: form.Id || undefined,
    Qa_comment: form.qaComment || undefined,
    Doc_type: form.docType || undefined,
    Requested_by_name: form.requested.name,
    Requested_by_designation: form.requested.designation,
    Requested_by_signature: form.requested.signature,
    Requested_by_date: form.requested.date,
    Reviewed_by_name: form.reviewed.name,
    Reviewed_by_designation: form.reviewed.designation,
    Reviewed_by_signature: form.reviewed.signature,
    Reviewed_by_date: form.reviewed.date,
    QA_manager_name: form.qaManager.name,
    QA_manager_signature: form.qaManager.signature,
    QA_manager_date: form.qaManager.date,
    Doc_officer_name: form.docOfficer.name,
    Doc_officer_signature: form.docOfficer.signature,
    Doc_officer_date: form.docOfficer.date,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      setSubmitStatus('⏳ جاري حفظ بيانات المستند الأساسية...');
      
      // 1. Save/Update SOP Header
      const sopHeaderPayload = buildSopHeaderPayload();
      const headerResponse = await axiosServices.post('/api/docrequest-form/addEdit', sopHeaderPayload);
      const headerId = headerResponse.data?.Id || form.Id;

      if (!headerId) {
        throw new Error('فشل في الحصول على معرف المستند');
      }

      // 2. Save Purpose (English)
      if (form.purposeEn) {
        setSubmitStatus('⏳ جاري حفظ الغرض (إنجليزي)...');
        await axiosServices.post('/api/soppurpose/addSop-Purpose', {
          Content_en: form.purposeEn,
          Content_ar: '',
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        });
      }

      // 3. Save Purpose (Arabic)
      if (form.purposeAr) {
        setSubmitStatus('⏳ جاري حفظ الغرض (عربي)...');
        await axiosServices.post('/api/soppurpose/addSop-Purpose', {
          Content_en: '',
          Content_ar: form.purposeAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        });
      }

      // 4. Save Scope (English)
      if (form.scopeEn) {
        setSubmitStatus('⏳ جاري حفظ مجال التطبيق (إنجليزي)...');
        await axiosServices.post('/api/sopScope/addSop-Scope', {
          Content_en: form.scopeEn,
          Content_ar: '',
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        });
      }

      // 5. Save Scope (Arabic)
      if (form.scopeAr) {
        setSubmitStatus('⏳ جاري حفظ مجال التطبيق (عربي)...');
        await axiosServices.post('/api/sopScope/addSop-Scope', {
          Content_en: '',
          Content_ar: form.scopeAr,
          Is_Current: 1,
          Is_Active: 1,
          Sop_HeaderId: headerId,
        });
      }

      // 6. Save Document Request Form
      setSubmitStatus('⏳ جاري حفظ نموذج طلب المستند...');
      const docRequestPayload = {
        ...buildDocRequestPayload(),
        sop_HeaderId: headerId,
      };
      await axiosServices.post('/api/docrequest-form/addEdit', docRequestPayload);

      setSubmitStatus('🎉 تم حفظ المستند بنجاح');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Swal.fire('تم', `تم ${id ? 'تحديث' : 'إنشاء'} المستند بنجاح!`, 'success').then(() => {
        navigate(-1);
      });
      
    } catch (err: any) {
      console.error(err);
      Swal.fire('خطأ', 'حدث خطأ أثناء الإرسال: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitLoading(false);
      setSubmitStatus('');
    }
  };

  if (!user) {
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
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={submitLoading}>
        <Box
          sx={{
            bgcolor: 'white',
            color: 'black',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            minWidth: 300,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {submitStatus}
          </Typography>
        </Box>
      </Backdrop>

      <Container sx={{ py: 4 }}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4">
                {id ? 'تعديل طلب مستند' : 'إنشاء طلب مستند جديد'}
              </Typography>
            </Box>

            {/* Type of Document (dropdown) */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="doc-type-label">Type of Document</InputLabel>
              <Select
                labelId="doc-type-label"
                value={form.docType}
                label="Type of Document"
                onChange={e => setForm(prev => ({ ...prev, docType: e.target.value }))}
              >
                <MenuItem value="SOP">Standard operating procedure (SOP)</MenuItem>
                <MenuItem value="MU">Quality management manual (MU)</MenuItem>
                <MenuItem value="SMF">Site master file (SMF)</MenuItem>
                <MenuItem value="PR">Protocol (PR)</MenuItem>
                <MenuItem value="PL">Plan (PL)</MenuItem>
                <MenuItem value="PC">Policy (PC)</MenuItem>
                <MenuItem value="ST">Study (ST)</MenuItem>
                <MenuItem value="WI">Work Instruction (WI)</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Department (dropdown) */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="dept-label-en">Department</InputLabel>
              <Select
                labelId="dept-label-en"
                value={form.department}
                label="Department"
                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
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

            {/* Document Title */}
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
                  inputProps={{ dir: 'rtl' }}
                />
              </Grid>
            </Grid>

            {/* Purpose - English & Arabic */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>Purpose (English):</Typography>
                <RichTextEditor
                  value={form.purposeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeEn: content }))}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>الغرض (عربي):</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.purposeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeAr: content }))}
                />
              </Grid>
            </Grid>

            {/* Scope - English & Arabic */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>Scope (English):</Typography>
                <RichTextEditor
                  value={form.scopeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeEn: content }))}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>مجال التطبيق (عربي):</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.scopeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeAr: content }))}
                />
              </Grid>
            </Grid>

            {/* Requested By / Reviewed By table - READ ONLY */}
            <TableContainer component={Paper} sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      Requested By
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      Reviewed By
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Name</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Name</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.designation}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.signature}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.signature}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* QA Comment - Rich Text Editor */}
            <Box mb={3}>
              <Typography fontWeight="bold" mb={1}>QA Comment:</Typography>
              <RichTextEditor
                value={form.qaComment}
                onChange={(content: string) => setForm(prev => ({ ...prev, qaComment: content }))}
              />
            </Box>

            {/* QA Manager Approval / Document Officer Approval table - READ ONLY */}
            <TableContainer component={Paper} sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      QA Manager Approval
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      Document Officer Approval
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Name</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Name</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.signature}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.signature}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>



            {/* Submit / Reset */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setForm(initialState)}
                disabled={loading || submitLoading}
              >
                إعادة تعيين
              </Button>
              <Button type="submit" variant="contained" disabled={loading || submitLoading}>
                {submitLoading ? 'جاري المعالجة...' : id ? 'حفظ التعديلات' : 'إنشاء المستند'}
              </Button>
            </Stack>
          </Paper>
        </form>
      </Container>
    </>
  );
};

export default NewDocumentRequestForm;
