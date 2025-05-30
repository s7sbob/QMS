// src/pages/DocumentRequestManagement.tsx
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
  LinearProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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

interface DocRequestForm {
  Id: string;
  sop_HeaderId: string;
  Requested_by: string;
  Request_date: string;
  Reviewed_by: string | null;
  RequestFrm_code: string;
  Reviewed_date: string | null;
  Request_status: number;
  Qa_comment: string;
  Doc_type: string;
  QaMan_Id: string | null;
  QaDoc_officerId: string | null;
  QaManApprove_Date: string | null;
  QaDoc_officerDate: string | null;
  User_Data_DocRequest_frm_Requested_byToUser_Data: any;
  User_Data_DocRequest_frm_Reviewed_byToUser_Data: any;
  User_Data_DocRequest_frm_QaMan_IdToUser_Data: any;
  User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data: any;
  Sop_header: any;
}

interface FormState {
  Id?: string | null;
  department: string;
  docTitle: string;
  docTitleAr: string;
  purposeEn: string;
  purposeAr: string;
  scopeEn: string;
  scopeAr: string;
  requested: RequestedBy;
  reviewed: RequestedBy;
  qaComment: string;
  docType: string;
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

const DocumentRequestManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useContext<IUser | null>(UserContext);
  const compId = user?.compId || '';

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [docRequestForm, setDocRequestForm] = useState<DocRequestForm | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [canEdit, setCanEdit] = useState(false);

  // تحديد الخطوات والحالات
  const getStatusSteps = () => [
    { label: 'طلب جديد', status: 8 },
    { label: 'تم الإرسال', status: 9 },
    { label: 'مراجعة المدير', status: 10 },
    { label: 'مراجعة QA Manager', status: 11 },
    { label: 'موافقة QA Officer', status: 12 },
    { label: 'مرفوض', status: 13 },
    { label: 'مرفوض من QA Manager', status: 14 },
  ];

  const getCurrentStepIndex = (status: number) => {
    const steps = getStatusSteps();
    const index = steps.findIndex(step => step.status === status);
    return index >= 0 ? index : 0;
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 8: return 'info';
      case 9: return 'warning';
      case 10: return 'primary';
      case 11: return 'secondary';
      case 12: return 'success';
      case 13:
      case 14: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: number) => {
    const steps = getStatusSteps();
    const step = steps.find(s => s.status === status);
    return step ? step.label : 'غير محدد';
  };

  // تحديد دور المستخدم
  useEffect(() => {
    if (user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name) {
      setUserRole(user.Users_Departments_Users_Departments_User_IdToUser_Data[0].User_Roles.Name);
    }
  }, [user]);

  // تحميل البيانات الأساسية
  useEffect(() => {
    if (user) {
      const currentDate = new Date().toISOString().split('T')[0];
      setForm(prev => ({
        ...prev,
        requested: {
          name: user.FName + ' ' + user.LName || '',
          designation: userRole || '',
          signature: user.signUrl || '',
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
          designation: 'QA Officer',
          signature: user.docOfficerSignature || '',
          date: currentDate,
        },
      }));
    }
  }, [user, userRole]);

  // تحميل الأقسام
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

  // تحميل بيانات الطلب إذا كان هناك ID
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosServices
        .get(`/api/docrequest-form/getbyid/${id}`)
        .then(res => {
          const data = res.data;
          setDocRequestForm(data);
          
          // تحديد إمكانية التعديل بناءً على الدور والحالة
          const canUserEdit = checkEditPermission(data, userRole, user?.Id ?? '');
          setCanEdit(canUserEdit);

          // ملء النموذج بالبيانات
          setForm(prev => ({
            ...prev,
            Id: data.sop_HeaderId,
            department: data.Sop_header?.Dept_Id || '',
            docTitle: data.Sop_header?.Doc_Title_en || '',
            docTitleAr: data.Sop_header?.Doc_Title_ar || '',
            qaComment: data.Qa_comment || '',
            docType: data.Doc_type || '',
            requested: {
              name: data.User_Data_DocRequest_frm_Requested_byToUser_Data?.FName + ' ' + 
                    data.User_Data_DocRequest_frm_Requested_byToUser_Data?.LName || '',
              designation: 'Requester',
              signature: data.User_Data_DocRequest_frm_Requested_byToUser_Data?.signUrl || '',
              date: data.Request_date ? new Date(data.Request_date).toLocaleDateString() : '',
            },
            reviewed: {
              name: data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.FName + ' ' + 
                    data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.LName || '',
              designation: 'Department Manager',
              signature: data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.signUrl || '',
              date: data.Reviewed_date ? new Date(data.Reviewed_date).toLocaleDateString() : '',
            },
            qaManager: {
              name: data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.FName + ' ' + 
                    data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.LName || '',
              designation: 'QA Manager',
              signature: data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.signUrl || '',
              date: data.QaManApprove_Date ? new Date(data.QaManApprove_Date).toLocaleDateString() : '',
            },
            docOfficer: {
              name: data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.FName + ' ' + 
                    data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.LName || '',
              designation: 'QA Officer',
              signature: data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.signUrl || '',
              date: data.QaDoc_officerDate ? new Date(data.QaDoc_officerDate).toLocaleDateString() : '',
            },
          }));
        })
        .catch(err => {
          console.error(err);
          Swal.fire('خطأ', 'فشل في جلب بيانات الطلب', 'error');
        })
        .finally(() => setLoading(false));
    } else {
      // إذا لم يكن هناك ID، تحميل الطلبات الخاصة بالمستخدم
      loadUserRequests();
    }
  }, [id, userRole, user?.Id]);

  const checkEditPermission = (docRequest: DocRequestForm, role: string, userId: string) => {
    if (!docRequest || !role || !userId) return false;

    const status = docRequest.Request_status;
    
    switch (role) {
      case 'QA Associate':
        return docRequest.Requested_by === userId && (status === 8 || status === 9);
      case 'Dept Manager':
        return status === 9;
      case 'QA Manager':
        return status === 10;
      case 'QA Officer':
        return status === 11;
      default:
        return false;
    }
  };

  const loadUserRequests = async () => {
    if (!user?.Id) return;
    
    setLoading(true);
    try {
      const response = await axiosServices.get('/api/docrequest-form/getall');
      const userRequests = response.data.filter((req: DocRequestForm) => 
        req.Requested_by === user.Id && req.Request_status < 12
      );
      
      if (userRequests.length > 0) {
        // عرض أحدث طلب للمستخدم
        const latestRequest = userRequests[0];
        setDocRequestForm(latestRequest);
        const canUserEdit = checkEditPermission(latestRequest, userRole, user.Id);
        setCanEdit(canUserEdit);
      }
    } catch (error) {
      console.error('Error loading user requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormState) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleStatusUpdate = async (newStatus: number, additionalData: any = {}) => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const payload = {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        ...additionalData,
      };

      // إضافة بيانات التوقيع حسب الدور
      if (userRole === 'Dept Manager' && newStatus === 10) {
        payload.Reviewed_by = user?.Id;
        payload.Reviewed_date = new Date().toISOString();
      } else if (userRole === 'QA Manager' && newStatus === 11) {
        payload.QaMan_Id = user?.Id;
        payload.QaManApprove_Date = new Date().toISOString();
      } else if (userRole === 'QA Officer' && newStatus === 12) {
        payload.QaDoc_officerId = user?.Id;
        payload.QaDoc_officerDate = new Date().toISOString();
      }

      await axiosServices.post('/api/docrequest-form/addEdit', payload);
      
      Swal.fire('تم', 'تم تحديث حالة الطلب بنجاح', 'success').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire('خطأ', 'حدث خطأ أثناء تحديث الحالة', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setSubmitLoading(true);
    
    try {
      setSubmitStatus('⏳ جاري حفظ البيانات...');
      
      if (docRequestForm) {
        // تحديث طلب موجود
        const payload = {
          Id: docRequestForm.Id,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
        };

        await axiosServices.post('/api/docrequest-form/addEdit', payload);
        
        // تحديث SOP Header إذا لزم الأمر
        if (userRole === 'QA Manager') {
          const sopHeaderPayload = {
            Id: form.Id,
            Doc_Title_en: form.docTitle,
            Doc_Title_ar: form.docTitleAr,
            Dept_Id: form.department,
            NOTES: form.qaComment,
            doc_Type: form.docType,
          };
          await axiosServices.post('/api/sopheader/addEditSopHeader', sopHeaderPayload);
        }
      } else {
        // إنشاء طلب جديد
        const sopHeaderPayload = {
          Doc_Title_en: form.docTitle,
          Doc_Title_ar: form.docTitleAr,
          Dept_Id: form.department,
          NOTES: form.qaComment,
          doc_Type: form.docType,
          status: '8',
        };
        
        const headerResponse = await axiosServices.post('/api/sopheader/addEditSopHeader', sopHeaderPayload);
        const headerId = headerResponse.data?.Id;

        if (!headerId) {
          throw new Error('فشل في إنشاء المستند');
        }

        // إنشاء طلب المستند
        const docRequestPayload = {
          sop_HeaderId: headerId,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
          Request_status: 8,
        };
        
        await axiosServices.post('/api/docrequest-form/addEdit', docRequestPayload);
      }

      setSubmitStatus('🎉 تم حفظ البيانات بنجاح');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Swal.fire('تم', 'تم حفظ البيانات بنجاح!', 'success').then(() => {
        if (!id) {
          navigate(-1);
        } else {
          window.location.reload();
        }
      });
      
    } catch (err: any) {
      console.error(err);
      Swal.fire('خطأ', 'حدث خطأ أثناء الحفظ: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitLoading(false);
      setSubmitStatus('');
    }
  };

  const renderActionButtons = () => {
    if (!docRequestForm) return null;

    const status = docRequestForm.Request_status;

    if (userRole === 'Dept Manager' && status === 9) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleStatusUpdate(10)}
            disabled={submitLoading}
          >
            موافقة المدير
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleStatusUpdate(13)}
            disabled={submitLoading}
          >
            رفض الطلب
          </Button>
        </Stack>
      );
    }

    if (userRole === 'QA Manager' && status === 10) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleStatusUpdate(11)}
            disabled={submitLoading}
          >
            موافقة QA Manager
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleStatusUpdate(14)}
            disabled={submitLoading}
          >
            رفض الطلب
          </Button>
        </Stack>
      );
    }

    if (userRole === 'QA Officer' && status === 11) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleStatusUpdate(12)}
            disabled={submitLoading}
          >
            موافقة QA Officer
          </Button>
        </Stack>
      );
    }

    if (userRole === 'QA Associate' && status === 8 && canEdit) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            disabled={submitLoading}
          >
            إرسال الطلب
          </Button>
        </Stack>
      );
    }

    return null;
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
        {/* Progress Bar */}
        {docRequestForm && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              حالة الطلب: {docRequestForm.RequestFrm_code}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={getStatusText(docRequestForm.Request_status)} 
                color={getStatusColor(docRequestForm.Request_status)}
                size="medium"
                sx={{ display: 'block', mx: 'auto', mb: 2 }}
              />
            </Box>

            <Stepper activeStep={getCurrentStepIndex(docRequestForm.Request_status)} alternativeLabel>
              {getStatusSteps().filter(step => ![13, 14].includes(step.status)).map((step) => (
                <Step key={step.status}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {[13, 14].includes(docRequestForm.Request_status) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                تم رفض الطلب
              </Alert>
            )}
          </Paper>
        )}

        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4">
                {id ? 'عرض طلب المستند' : 'إنشاء طلب مستند جديد'}
              </Typography>
              {docRequestForm && (
                <Typography variant="subtitle1" color="text.secondary">
                  رقم الطلب: {docRequestForm.RequestFrm_code}
                </Typography>
              )}
            </Box>

            {/* نوع المستند */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="doc-type-label">نوع المستند</InputLabel>
              <Select
                labelId="doc-type-label"
                value={form.docType}
                label="نوع المستند"
                onChange={e => setForm(prev => ({ ...prev, docType: e.target.value }))}
                disabled={!canEdit}
              >
                <MenuItem value="SOP">إجراء تشغيل معياري (SOP)</MenuItem>
                <MenuItem value="MU">دليل إدارة الجودة (MU)</MenuItem>
                <MenuItem value="SMF">ملف الموقع الرئيسي (SMF)</MenuItem>
                <MenuItem value="PR">بروتوكول (PR)</MenuItem>
                <MenuItem value="PL">خطة (PL)</MenuItem>
                <MenuItem value="PC">سياسة (PC)</MenuItem>
                <MenuItem value="ST">دراسة (ST)</MenuItem>
                <MenuItem value="WI">تعليمات العمل (WI)</MenuItem>
                <MenuItem value="O">أخرى</MenuItem>
              </Select>
            </FormControl>

            {/* القسم */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="dept-label">القسم</InputLabel>
              <Select
                labelId="dept-label"
                value={form.department}
                label="القسم"
                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                disabled={!canEdit}
              >
                {loading ? (
                  <MenuItem disabled>جاري التحميل...</MenuItem>
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

            {/* عنوان المستند */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="عنوان المستند (إنجليزي)"
                  value={form.docTitle}
                  onChange={handleChange('docTitle')}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="عنوان المستند (عربي)"
                  value={form.docTitleAr}
                  onChange={handleChange('docTitleAr')}
                  inputProps={{ dir: 'rtl' }}
                  disabled={!canEdit}
                />
              </Grid>
            </Grid>

            {/* الغرض والنطاق - للعرض فقط */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>الغرض (إنجليزي):</Typography>
                <RichTextEditor
                  value={form.purposeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeEn: content }))}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>الغرض (عربي):</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.purposeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeAr: content }))}
                  disabled={!canEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>النطاق (إنجليزي):</Typography>
                <RichTextEditor
                  value={form.scopeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeEn: content }))}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>النطاق (عربي):</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.scopeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeAr: content }))}
                  disabled={!canEdit}
                />
              </Grid>
            </Grid>

            {/* جدول التوقيعات */}
            <TableContainer component={Paper} sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      طلب من
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      مراجعة من
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>الاسم</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>الاسم</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>المنصب</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.designation}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>المنصب</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.designation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>التوقيع</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.requested.signature && (
                        <img src={form.requested.signature} alt="توقيع" style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>التوقيع</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.reviewed.signature && (
                        <img src={form.reviewed.signature} alt="توقيع" style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.date}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* تعليق QA */}
            <Box mb={3}>
              <Typography fontWeight="bold" mb={1}>تعليق QA:</Typography>
              <RichTextEditor
                value={form.qaComment}
                onChange={(content: string) => setForm(prev => ({ ...prev, qaComment: content }))}
                disabled={!canEdit || (userRole !== 'QA Manager' && userRole !== 'QA Associate')}
              />
            </Box>

            {/* جدول موافقات QA */}
            <TableContainer component={Paper} sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      موافقة مدير QA
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      موافقة مسؤول الوثائق
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>الاسم</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>الاسم</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>التوقيع</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.qaManager.signature && (
                        <img src={form.qaManager.signature} alt="توقيع" style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>التوقيع</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.docOfficer.signature && (
                        <img src={form.docOfficer.signature} alt="توقيع" style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.date}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* أزرار الإجراءات */}
            <Box sx={{ mt: 3 }}>
              {renderActionButtons()}
              
              {canEdit && userRole === 'QA Manager' && (
                <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || submitLoading}
                  >
                    حفظ التعديلات
                  </Button>
                </Stack>
              )}
            </Box>
          </Paper>
        </form>
      </Container>
    </>
  );
};

export default DocumentRequestManagement;
