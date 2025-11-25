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
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosServices from 'src/utils/axiosServices';
import RichTextEditor from './components/RichTextEditor';
import { UserContext, IUser } from 'src/context/UserContext';
import Swal from 'sweetalert2';

interface RequestedBy {
  name: string;
  designation: string;
  signature: string;
  date: string;
}

interface DepartmentManager {
  Id: string;
  FName?: string;
  LName?: string;
}

interface Department {
  Id: string;
  Dept_name: string;
  Dept_manager?: string;
  departmentManager?: DepartmentManager | null;
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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId'); // Get headerId from URL query params
  const navigate = useNavigate();
  const user = useContext<IUser | null>(UserContext);
  const compId = user?.compId ||
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.Department_Data?.comp_ID ||
    '';

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
    { label: t('status.newRequest'), status: 8 },
    { label: t('status.submitted'), status: 9 },
    { label: t('status.managerReview'), status: 10 },
    { label: t('status.qaManagerReview'), status: 11 },
    { label: t('status.qaOfficerApproval'), status: 12 },
    { label: t('status.rejected'), status: 13 },
    { label: t('status.rejectedByQAManager'), status: 14 },
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
    return step ? step.label : t('status.undefined');
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
    if (compId && compId !== 'undefined') {
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
    } else if (compId === '' || compId === 'undefined') {
      console.warn('Invalid compId:', compId);
    }
  }, [compId]);

  // تحميل بيانات الطلب إذا كان هناك ID
  useEffect(() => {
    const loadRequestFormData = async () => {
      setLoading(true);
      try {
        const res = await axiosServices.get(`/api/docrequest-form/getbyid/${id}`);
        const data = res.data;
        setDocRequestForm(data);

        // تحديد إمكانية التعديل بناءً على الدور والحالة
        const canUserEdit = checkEditPermission(data, userRole, user?.Id ?? '');
        setCanEdit(canUserEdit);

        const sopHeaderId = data.sop_HeaderId;

        // Load scope data
        let scopeEn = '';
        let scopeAr = '';
        if (sopHeaderId) {
          try {
            const scopeRes = await axiosServices.get(`/api/sopScope/getAllHistory/${sopHeaderId}`);
            const scopeData = Array.isArray(scopeRes.data) ? scopeRes.data : [];
            const currentScope = scopeData.find((s: any) => s.Is_Current === 1) || scopeData[0];
            if (currentScope) {
              scopeEn = currentScope.Content_en || '';
              scopeAr = currentScope.Content_ar || '';
            }
          } catch (err) {
            console.log('No scope data found');
          }
        }

        // Load purpose data
        let purposeEn = '';
        let purposeAr = '';
        if (sopHeaderId) {
          try {
            const purposeRes = await axiosServices.get(`/api/soppurpose/getAllHistory/${sopHeaderId}`);
            const purposeData = Array.isArray(purposeRes.data) ? purposeRes.data : [];
            const currentPurpose = purposeData.find((p: any) => p.Is_Current === 1) || purposeData[0];
            if (currentPurpose) {
              purposeEn = currentPurpose.Content_en || '';
              purposeAr = currentPurpose.Content_ar || '';
            }
          } catch (err) {
            console.log('No purpose data found');
          }
        }

        // ملء النموذج بالبيانات
        setForm(prev => ({
          ...prev,
          Id: sopHeaderId,
          department: data.Sop_header?.Dept_Id || '',
          docTitle: data.Sop_header?.Doc_Title_en || '',
          docTitleAr: data.Sop_header?.Doc_Title_ar || '',
          qaComment: data.Qa_comment || '',
          docType: data.Doc_type || data.Sop_header?.doc_Type || '',
          purposeEn,
          purposeAr,
          scopeEn,
          scopeAr,
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
      } catch (err) {
        console.error(err);
        Swal.fire('خطأ', 'فشل في جلب بيانات الطلب', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRequestFormData();
    } else {
      // For new requests, QA Associate should be able to edit
      if (userRole === 'QA Associate') {
        setCanEdit(true);
      }
      // إذا لم يكن هناك ID، تحميل الطلبات الخاصة بالمستخدم
      loadUserRequests();
    }
  }, [id, userRole, user?.Id]);

  // Load SOP header data when headerId is provided (from SOPCard navigation)
  useEffect(() => {
    const loadSopData = async (sopHeaderId: string) => {
      setLoading(true);
      try {
        // Load SOP header
        const headerRes = await axiosServices.get(`/api/sopheader/getSopHeaderById/${sopHeaderId}`);
        const sopHeader = headerRes.data;
        console.log('Loaded SOP header data:', sopHeader);

        // Load scope data
        let scopeEn = '';
        let scopeAr = '';
        try {
          const scopeRes = await axiosServices.get(`/api/sopScope/getAllHistory/${sopHeaderId}`);
          const scopeData = Array.isArray(scopeRes.data) ? scopeRes.data : [];
          const currentScope = scopeData.find((s: any) => s.Is_Current === 1) || scopeData[0];
          if (currentScope) {
            scopeEn = currentScope.Content_en || '';
            scopeAr = currentScope.Content_ar || '';
          }
        } catch (err) {
          console.log('No scope data found');
        }

        // Load purpose data
        let purposeEn = '';
        let purposeAr = '';
        try {
          const purposeRes = await axiosServices.get(`/api/soppurpose/getAllHistory/${sopHeaderId}`);
          const purposeData = Array.isArray(purposeRes.data) ? purposeRes.data : [];
          const currentPurpose = purposeData.find((p: any) => p.Is_Current === 1) || purposeData[0];
          if (currentPurpose) {
            purposeEn = currentPurpose.Content_en || '';
            purposeAr = currentPurpose.Content_ar || '';
          }
        } catch (err) {
          console.log('No purpose data found');
        }

        setForm(prev => ({
          ...prev,
          Id: sopHeader.Id,
          department: sopHeader.Dept_Id || '',
          docTitle: sopHeader.Doc_Title_en || '',
          docTitleAr: sopHeader.Doc_Title_ar || '',
          docType: sopHeader.doc_Type || '',
          purposeEn,
          purposeAr,
          scopeEn,
          scopeAr,
        }));

        // Allow editing for this pre-loaded SOP
        if (userRole === 'QA Associate' || userRole === 'Dept Manager') {
          setCanEdit(true);
        }
      } catch (err) {
        console.error('Error loading SOP header:', err);
        Swal.fire('خطأ', 'فشل في جلب بيانات المستند', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (headerId && !id) {
      loadSopData(headerId);
    }
  }, [headerId, id, userRole]);

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

  // Helper function to get department manager ID
  const getDepartmentManagerId = (departmentId: string): string | null => {
    const dept = departments.find(d => d.Id === departmentId);
    console.log('getDepartmentManagerId - Looking for department:', departmentId);
    console.log('getDepartmentManagerId - Found department:', dept);
    console.log('getDepartmentManagerId - departmentManager object:', dept?.departmentManager);
    console.log('getDepartmentManagerId - Dept_manager string:', dept?.Dept_manager);

    // First try to get from departmentManager object (returned by API)
    if (dept?.departmentManager?.Id) {
      console.log('getDepartmentManagerId - Using departmentManager.Id:', dept.departmentManager.Id);
      return dept.departmentManager.Id;
    }
    // Fallback to Dept_manager string field
    const fallbackId = dept?.Dept_manager || null;
    console.log('getDepartmentManagerId - Using fallback Dept_manager:', fallbackId);
    return fallbackId;
  };

  // Helper function to send notification
  const sendNotification = async (targetUserId: string, message: string, data: any = {}) => {
    try {
      await axiosServices.post('/api/notifications/pushNotification', {
        targetUserId,
        message,
        data,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Check if current user is Dept Manager viewing a request in their department
  const isDeptManagerViewingRequest = (): boolean => {
    if (userRole !== 'Dept Manager' || !docRequestForm || !id) return false;
    // Check if the request is in status 8 (new request)
    if (docRequestForm.Request_status !== 8) return false;
    // Check if the user is the dept manager of the same department
    const requestDeptId = docRequestForm.Sop_header?.Dept_Id;
    const userDeptId = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.Department_Id;
    return requestDeptId === userDeptId;
  };

  // Check if QA Associate is creating/editing a request (should hide QA sections)
  const isQAAssociateCreatingNew = (): boolean => {
    // QA Associate creating new request (no id, no docRequestForm)
    // OR QA Associate viewing via headerId (from SOPCard navigation)
    // OR QA Associate viewing existing request with status 8
    if (userRole !== 'QA Associate') return false;

    // New request without any existing form
    if (!id && !docRequestForm) return true;

    // Navigated from SOPCard with headerId
    if (headerId && !id) return true;

    // Viewing existing request with status 8 (new request status)
    if (docRequestForm && docRequestForm.Request_status === 8) return true;

    return false;
  };

  // Should hide QA sections (for both Dept Manager viewing and QA Associate creating new)
  const shouldHideQASections = (): boolean => {
    return isDeptManagerViewingRequest() || isQAAssociateCreatingNew();
  };

  // Handle Dept Manager approval/rejection
  const handleDeptManagerAction = async (action: 'approve' | 'reject') => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const newStatus = action === 'approve' ? 12 : 13;

      // Update SOP header status
      await axiosServices.post('/api/sopheader/addEditSopHeader', {
        Id: docRequestForm.sop_HeaderId,
        status: String(newStatus),
      });

      // Update doc request form status
      await axiosServices.post('/api/docrequest-form/addEdit', {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        Reviewed_by: user?.Id,
        Reviewed_date: new Date().toISOString(),
      });

      const actionText = action === 'approve' ? 'تمت الموافقة على' : 'تم رفض';
      Swal.fire('تم', `${actionText} الطلب بنجاح`, 'success').then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire('خطأ', 'حدث خطأ أثناء تحديث الحالة', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

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

  // Helper function to save scope and purpose
  const saveScopeAndPurpose = async (sopHeaderId: string) => {
    // Save Purpose
    if (form.purposeEn || form.purposeAr) {
      setSubmitStatus(`⏳ ${t('messages.savingPurpose')}`);
      await axiosServices.post('/api/soppurpose/addSop-Purpose', {
        Content_en: form.purposeEn,
        Content_ar: form.purposeAr,
        Is_Current: 1,
        Is_Active: 1,
        Sop_HeaderId: sopHeaderId,
      });
    }

    // Save Scope
    if (form.scopeEn || form.scopeAr) {
      setSubmitStatus(`⏳ ${t('messages.savingScope')}`);
      await axiosServices.post('/api/sopScope/addsop-scope', {
        Content_en: form.scopeEn,
        Content_ar: form.scopeAr,
        Is_Current: 1,
        Is_Active: 1,
        Sop_HeaderId: sopHeaderId,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setSubmitLoading(true);

    try {
      setSubmitStatus(`⏳ ${t('messages.savingData')}`);

      if (docRequestForm) {
        // تحديث طلب موجود
        setSubmitStatus(`⏳ ${t('messages.updatingRequest')}`);
        const payload = {
          Id: docRequestForm.Id,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
        };

        await axiosServices.post('/api/docrequest-form/addEdit', payload);

        // تحديث SOP Header
        setSubmitStatus(`⏳ ${t('messages.updatingDocument')}`);
        const sopHeaderPayload = {
          Id: docRequestForm.sop_HeaderId,
          Doc_Title_en: form.docTitle,
          Doc_Title_ar: form.docTitleAr,
          Dept_Id: form.department,
          NOTES: form.qaComment,
          doc_Type: form.docType,
        };
        await axiosServices.post('/api/sopheader/addEditSopHeader', sopHeaderPayload);

        // Save scope and purpose
        await saveScopeAndPurpose(docRequestForm.sop_HeaderId);
      } else if (headerId) {
        // تحديث SOP موجود (من SOPCard navigation)
        setSubmitStatus(`⏳ ${t('messages.updatingDocument')}`);
        const sopHeaderPayload = {
          Id: headerId,
          Doc_Title_en: form.docTitle,
          Doc_Title_ar: form.docTitleAr,
          Dept_Id: form.department,
          NOTES: form.qaComment,
          doc_Type: form.docType,
        };
        await axiosServices.post('/api/sopheader/addEditSopHeader', sopHeaderPayload);

        // Save scope and purpose
        await saveScopeAndPurpose(headerId);

        // إنشاء طلب المستند إذا لم يكن موجوداً
        setSubmitStatus(`⏳ ${t('messages.creatingRequest')}`);
        const docRequestPayload = {
          sop_HeaderId: headerId,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
          Request_status: 8,
        };
        await axiosServices.post('/api/docrequest-form/addEdit', docRequestPayload);

        // Send notification to Department Manager
        setSubmitStatus(`⏳ ${t('messages.sendingNotifications')}`);
        const deptManagerId = getDepartmentManagerId(form.department);
        if (deptManagerId) {
          const employeeName = `${user?.FName || ''} ${user?.LName || ''}`.trim();
          const notificationMessage = `New document request for "${form.docTitle}" is submitted by employee "${employeeName}" and waiting for your review.`;
          await sendNotification(deptManagerId, notificationMessage, {
            sopHeaderId: headerId,
            docTitle: form.docTitle,
            requestedBy: user?.Id,
          });
        }
      } else {
        // إنشاء طلب جديد
        setSubmitStatus(`⏳ ${t('messages.creatingDocument')}`);
        const sopHeaderPayload = {
          Doc_Title_en: form.docTitle,
          Doc_Title_ar: form.docTitleAr,
          Dept_Id: form.department,
          NOTES: form.qaComment,
          doc_Type: form.docType,
          status: '8',
        };

        const headerResponse = await axiosServices.post('/api/sopheader/addEditSopHeader', sopHeaderPayload);
        const newHeaderId = headerResponse.data?.Id;
        const docCode = headerResponse.data?.Doc_Code;

        if (!newHeaderId) {
          throw new Error(t('messages.failedCreateDocument'));
        }

        // Save scope and purpose
        await saveScopeAndPurpose(newHeaderId);

        // إنشاء طلب المستند
        setSubmitStatus(`⏳ ${t('messages.creatingRequest')}`);
        const docRequestPayload = {
          sop_HeaderId: newHeaderId,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
          Request_status: 8,
        };

        await axiosServices.post('/api/docrequest-form/addEdit', docRequestPayload);

        // Send notification to Department Manager
        setSubmitStatus(`⏳ ${t('messages.sendingNotifications')}`);
        const deptManagerId = getDepartmentManagerId(form.department);
        console.log('Department ID:', form.department);
        console.log('Department Manager ID:', deptManagerId);
        console.log('Departments:', departments);

        if (deptManagerId) {
          const employeeName = `${user?.FName || ''} ${user?.LName || ''}`.trim();
          const notificationMessage = `New document "${docCode}" with title "${form.docTitle}" is requested by employee "${employeeName}" and waiting for your review.`;
          console.log('Sending notification to:', deptManagerId, notificationMessage);
          await sendNotification(deptManagerId, notificationMessage, {
            sopHeaderId: newHeaderId,
            docCode,
            docTitle: form.docTitle,
            requestedBy: user?.Id,
          });
        } else {
          console.warn('No department manager found for department:', form.department);
        }
      }

      setSubmitStatus(`🎉 ${t('messages.dataSavedSuccess')}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      Swal.fire(t('messages.success'), t('messages.dataSavedSuccess'), 'success').then(() => {
        if (!id) {
          navigate(-1);
        } else {
          window.location.reload();
        }
      });

    } catch (err: any) {
      console.error(err);
      Swal.fire(t('messages.error'), `${t('messages.errorSaving')}: ${err.response?.data?.message || err.message}`, 'error');
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

  // Show loading screen while user data is loading
  if (!user) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" mt={2} color="primary">
          {t('messages.loadingUserData')}
        </Typography>
      </Box>
    );
  }

  // Show loading screen while form data is being fetched
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" mt={2} color="primary">
          {t('messages.loadingData')}
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
            {submitStatus || t('messages.savingData')}
          </Typography>
        </Box>
      </Backdrop>

      <Container sx={{ py: 4 }}>
        {/* Progress Bar */}
        {docRequestForm && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              {t('documentRequest.requestStatus')}: {docRequestForm.RequestFrm_code}
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
                {t('documentRequest.requestRejected')}
              </Alert>
            )}
          </Paper>
        )}

        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4">
                {id ? t('documentRequest.viewTitle') : t('documentRequest.title')}
              </Typography>
              {docRequestForm && (
                <Typography variant="subtitle1" color="text.secondary">
                  {t('documentRequest.requestNumber')}: {docRequestForm.RequestFrm_code}
                </Typography>
              )}
            </Box>

            {/* نوع المستند */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="doc-type-label">{t('documentRequest.documentType')}</InputLabel>
              <Select
                labelId="doc-type-label"
                value={form.docType}
                label={t('documentRequest.documentType')}
                onChange={e => setForm(prev => ({ ...prev, docType: e.target.value }))}
                disabled={!canEdit}
              >
                <MenuItem value="SOP">{t('docTypes.sop')}</MenuItem>
                <MenuItem value="MU">{t('docTypes.mu')}</MenuItem>
                <MenuItem value="SMF">{t('docTypes.smf')}</MenuItem>
                <MenuItem value="PR">{t('docTypes.pr')}</MenuItem>
                <MenuItem value="PL">{t('docTypes.pl')}</MenuItem>
                <MenuItem value="PC">{t('docTypes.pc')}</MenuItem>
                <MenuItem value="ST">{t('docTypes.st')}</MenuItem>
                <MenuItem value="WI">{t('docTypes.wi')}</MenuItem>
                <MenuItem value="O">{t('docTypes.other')}</MenuItem>
              </Select>
            </FormControl>

            {/* القسم */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="dept-label">{t('documentRequest.department')}</InputLabel>
              <Select
                labelId="dept-label"
                value={form.department}
                label={t('documentRequest.department')}
                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                disabled={!canEdit}
              >
                {loading ? (
                  <MenuItem disabled>{t('documentRequest.loading')}</MenuItem>
                ) : departments.length ? (
                  departments.map((d) => (
                    <MenuItem key={d.Id} value={d.Id}>
                      {d.Dept_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t('documentRequest.noDepartments')}</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* عنوان المستند */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('documentRequest.documentTitleEn')}
                  value={form.docTitle}
                  onChange={handleChange('docTitle')}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('documentRequest.documentTitleAr')}
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
                <Typography fontWeight="bold" mb={1}>{t('documentRequest.purposeEn')}:</Typography>
                <RichTextEditor
                  value={form.purposeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeEn: content }))}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>{t('documentRequest.purposeAr')}:</Typography>
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
                <Typography fontWeight="bold" mb={1}>{t('documentRequest.scopeEn')}:</Typography>
                <RichTextEditor
                  value={form.scopeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeEn: content }))}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>{t('documentRequest.scopeAr')}:</Typography>
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
                      {t('documentRequest.requestedBy')}
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                    >
                      {t('documentRequest.reviewedBy')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('documentRequest.name')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('documentRequest.name')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.designation')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.designation}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.designation')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.designation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.signature')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.requested.signature && (
                        <img src={form.requested.signature} alt={t('documentRequest.signature')} style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.signature')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.reviewed.signature && (
                        <img src={form.reviewed.signature} alt={t('documentRequest.signature')} style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.date')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.date}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.date')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* QA Associate Creating New Request - Show Submit + Cancel buttons */}
            {isQAAssociateCreatingNew() && (
              <Box sx={{ mt: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={submitLoading}
                  >
                    {t('buttons.sendRequest')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => navigate(-1)}
                    disabled={submitLoading}
                  >
                    {t('buttons.cancel')}
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Dept Manager Action Buttons - Show only for Dept Manager viewing a request */}
            {isDeptManagerViewingRequest() && (
              <Box sx={{ mt: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => handleDeptManagerAction('approve')}
                    disabled={submitLoading}
                  >
                    {t('buttons.approve')}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={() => handleDeptManagerAction('reject')}
                    disabled={submitLoading}
                  >
                    {t('buttons.reject')}
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Hide QA sections for Dept Manager viewing a request OR QA Associate creating new */}
            {!shouldHideQASections() && (
              <>
                {/* تعليق QA */}
                <Box mb={3}>
                  <Typography fontWeight="bold" mb={1}>{t('documentRequest.qaComment')}:</Typography>
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
                          {t('documentRequest.qaManagerApproval')}
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          align="center"
                          sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'black' }}
                        >
                          {t('documentRequest.docOfficerApproval')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('documentRequest.name')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.name}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('documentRequest.name')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.signature')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>
                          {form.qaManager.signature && (
                            <img src={form.qaManager.signature} alt={t('documentRequest.signature')} style={{ maxHeight: 50 }} />
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.signature')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>
                          {form.docOfficer.signature && (
                            <img src={form.docOfficer.signature} alt={t('documentRequest.signature')} style={{ maxHeight: 50 }} />
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.date')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>{form.qaManager.date}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.date')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>{form.docOfficer.date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* أزرار الإجراءات - Hide for Dept Manager viewing a request OR QA Associate creating new */}
            {!shouldHideQASections() && (
              <Box sx={{ mt: 3 }}>
                {renderActionButtons()}

                {canEdit && userRole === 'QA Manager' && (
                  <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || submitLoading}
                    >
                      {t('buttons.saveChanges')}
                    </Button>
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </form>
      </Container>
    </>
  );
};

export default DocumentRequestManagement;
