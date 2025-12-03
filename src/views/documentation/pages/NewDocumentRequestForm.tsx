// src/pages/DocumentRequestManagement.tsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosServices from 'src/utils/axiosServices';
import RichTextEditor from './components/RichTextEditor';
import { UserContext, IUser } from 'src/context/UserContext';
import Swal from 'sweetalert2';
import { IconPrinter } from '@tabler/icons-react';

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
  const { t, i18n } = useTranslation();
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
  const [documentOption, setDocumentOption] = useState<'new' | 'merge'>('new');
  const [selectedSopCode, setSelectedSopCode] = useState<string>('');
  const [sopCodes, setSopCodes] = useState<{ Id: string; Doc_Code: string; Doc_Title_en: string }[]>([]);
  const [sopHeaderStatus, setSopHeaderStatus] = useState<string | number | null>(null);

  // Track original form values to detect changes (only update changed sections)
  const originalFormRef = useRef<FormState | null>(null);

  // Helper to detect which sections have changed
  const getChangedSections = useCallback(() => {
    const original = originalFormRef.current;
    if (!original) {
      // No original data means new form - all sections are "changed"
      return {
        header: true,
        purpose: true,
        scope: true,
        docRequest: true,
      };
    }

    return {
      // Header section: docTitle, docTitleAr, department, docType
      header:
        form.docTitle !== original.docTitle ||
        form.docTitleAr !== original.docTitleAr ||
        form.department !== original.department ||
        form.docType !== original.docType,

      // Purpose section: purposeEn, purposeAr
      purpose:
        form.purposeEn !== original.purposeEn ||
        form.purposeAr !== original.purposeAr,

      // Scope section: scopeEn, scopeAr
      scope:
        form.scopeEn !== original.scopeEn ||
        form.scopeAr !== original.scopeAr,

      // Doc Request section: qaComment, docType
      docRequest:
        form.qaComment !== original.qaComment ||
        form.docType !== original.docType,
    };
  }, [form]);

  // تحديد الخطوات والحالات - Status names from database
  const getStatusSteps = () => {
    const isArabic = i18n.language === 'ar';

    return [
      {
        label: isArabic ? 'طلب إنشاء جديد' : 'Request For New Creation',
        status: 8
      },
      {
        label: isArabic ? 'تم مراجعه طلب الانشاء' : 'New Creation Request Reviewed',
        status: 11
      },
      {
        label: isArabic ? 'تم الموافقه علي الأنشاء بواسطه رئيس القسم' : 'Approved by Department Manager',
        status: 12
      },
      {
        label: isArabic ? 'تم الرفض بواسطه رئيس القسم' : 'Refused by Department Manager',
        status: 13
      },
      {
        label: isArabic ? 'تم الرفض بواسطه مدير الجوده' : 'Refused by QA Manager',
        status: 14
      },
      {
        label: isArabic ? 'تم الموافقه علي الإنشاء بواسطه مدير الجوده' : 'Accepted by QA Manager',
        status: 15
      },
      {
        label: isArabic ? 'تم الموافقه علي الإنشاء بواسطه مدير الوثائق' : 'Accepted by QA Officer',
        status: 16
      },
      {
        label: isArabic ? 'تم الرفض بواسطه مدير الوثائق' : 'Rejected by QA Officer',
        status: 17
      },
    ];
  };

  const getCurrentStepIndex = (status: number) => {
    // Filter out rejected statuses to match the displayed stepper
    const filteredSteps = getStatusSteps().filter(step => ![13, 14, 17].includes(step.status));

    // For rejected by Dept Manager (13), show at step 1 (after Request For New Creation)
    if (status === 13) return 1;
    // For rejected by QA Manager (14), show at step 2 (after Approved by Dept Manager)
    if (status === 14) return 2;
    // For rejected by QA Officer (17), show at step 3 (after Accepted by QA Manager)
    if (status === 17) return 3;

    // Find index in the filtered array (matches what's displayed in stepper)
    const index = filteredSteps.findIndex(step => step.status === status);
    return index >= 0 ? index : 0;
  };

  const getStatusColor = (status: number): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 8: return 'info';           // New Request
      case 11: return 'warning';       // Reviewed
      case 12: return 'success';       // Approved by Dept Manager
      case 15: return 'success';       // Approved by QA Manager
      case 16: return 'success';       // Approved by QA Officer
      case 13: return 'error';         // Rejected by Dept Manager
      case 14: return 'error';         // Rejected by QA Manager
      case 17: return 'error';         // Rejected by QA Officer
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

  // تحميل البيانات الأساسية - فقط عند إنشاء طلب جديد (بدون id و بدون docRequestForm)
  useEffect(() => {
    // Only set current user data when creating NEW request (no id and no existing form data)
    // For existing requests, data comes from API in loadRequestFormData
    // Note: Signature is NOT set here - it will be added only when user submits the form
    if (user && !id && !docRequestForm) {
      const currentDate = new Date().toISOString().split('T')[0];
      setForm(prev => ({
        ...prev,
        requested: {
          name: `${user.FName || ''} ${user.LName || ''}`.trim(),
          designation: userRole || '',
          signature: '', // Signature will be added on form submission
          date: currentDate,
        },
        // reviewed, qaManager, docOfficer should remain empty until approved
        reviewed: { name: '', designation: 'Department Manager', signature: '', date: '' },
        qaManager: { name: '', designation: 'QA Manager', signature: '', date: '' },
        docOfficer: { name: '', designation: 'QA Officer', signature: '', date: '' },
      }));
    }
  }, [user, userRole, id, docRequestForm]);

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

  // Fetch SOP codes when "merge" option is selected
  useEffect(() => {
    const fetchSopCodes = async () => {
      if (documentOption === 'merge' && compId) {
        try {
          const response = await axiosServices.get(`/api/sopheader/getAllSopHeaders?compId=${compId}`);
          const data = response.data?.data || response.data || [];
          setSopCodes(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching SOP codes:', error);
          setSopCodes([]);
        }
      }
    };
    fetchSopCodes();
  }, [documentOption, compId]);

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
        const loadedFormData: FormState = {
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
            name: `${data.User_Data_DocRequest_frm_Requested_byToUser_Data?.FName || ''} ${data.User_Data_DocRequest_frm_Requested_byToUser_Data?.LName || ''}`.trim(),
            designation: 'Requester',
            signature: data.User_Data_DocRequest_frm_Requested_byToUser_Data?.signUrl || '',
            date: data.Request_date ? new Date(data.Request_date).toLocaleDateString() : '',
          },
          reviewed: {
            name: `${data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.FName || ''} ${data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.LName || ''}`.trim(),
            designation: 'Department Manager',
            signature: data.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.signUrl || '',
            date: data.Reviewed_date ? new Date(data.Reviewed_date).toLocaleDateString() : '',
          },
          qaManager: {
            name: `${data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.FName || ''} ${data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.LName || ''}`.trim(),
            designation: 'QA Manager',
            signature: data.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.signUrl || '',
            date: data.QaManApprove_Date ? new Date(data.QaManApprove_Date).toLocaleDateString() : '',
          },
          docOfficer: {
            name: `${data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.FName || ''} ${data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.LName || ''}`.trim(),
            designation: 'QA Officer',
            signature: data.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.signUrl || '',
            date: data.QaDoc_officerDate ? new Date(data.QaDoc_officerDate).toLocaleDateString() : '',
          },
        };

        setForm(loadedFormData);
        // Save original values for change detection
        originalFormRef.current = { ...loadedFormData };
      } catch (err) {
        console.error(err);
        Swal.fire(String(t('messages.error')), String(t('messages.failedFetchRequest')), 'error');
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
      // Always start with a fresh form when creating new request
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

        // Store SOP header status for notification logic
        setSopHeaderStatus(sopHeader.status || sopHeader.Status || null);

        // Check if there's an existing DocRequest_frm for this SOP header
        let existingDocRequest = null;
        try {
          const docRequestRes = await axiosServices.get(`/api/docrequest-form/bysopheader/${sopHeaderId}`);
          if (docRequestRes.data) {
            existingDocRequest = docRequestRes.data;
            setDocRequestForm(existingDocRequest);
            console.log('Found existing DocRequest_frm:', existingDocRequest);
          }
        } catch (err) {
          console.log('No existing DocRequest_frm found for this SOP header');
        }

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

        // Build form data with signatures if existing DocRequest_frm found
        const loadedFormData: Partial<FormState> = {
          Id: sopHeader.Id,
          department: sopHeader.Dept_Id || '',
          docTitle: sopHeader.Doc_Title_en || '',
          docTitleAr: sopHeader.Doc_Title_ar || '',
          docType: existingDocRequest?.Doc_type || sopHeader.doc_Type || '',
          purposeEn,
          purposeAr,
          scopeEn,
          scopeAr,
          qaComment: existingDocRequest?.Qa_comment || '',
        };

        // Add user signatures if existing DocRequest_frm found
        if (existingDocRequest) {
          loadedFormData.requested = {
            name: `${existingDocRequest.User_Data_DocRequest_frm_Requested_byToUser_Data?.FName || ''} ${existingDocRequest.User_Data_DocRequest_frm_Requested_byToUser_Data?.LName || ''}`.trim(),
            designation: 'Requester',
            signature: existingDocRequest.User_Data_DocRequest_frm_Requested_byToUser_Data?.signUrl || '',
            date: existingDocRequest.Request_date ? new Date(existingDocRequest.Request_date).toLocaleDateString() : '',
          };
          loadedFormData.reviewed = {
            name: `${existingDocRequest.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.FName || ''} ${existingDocRequest.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.LName || ''}`.trim(),
            designation: 'Department Manager',
            signature: existingDocRequest.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.signUrl || '',
            date: existingDocRequest.Reviewed_date ? new Date(existingDocRequest.Reviewed_date).toLocaleDateString() : '',
          };
          loadedFormData.qaManager = {
            name: `${existingDocRequest.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.FName || ''} ${existingDocRequest.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.LName || ''}`.trim(),
            designation: 'QA Manager',
            signature: existingDocRequest.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.signUrl || '',
            date: existingDocRequest.QaManApprove_Date ? new Date(existingDocRequest.QaManApprove_Date).toLocaleDateString() : '',
          };
          loadedFormData.docOfficer = {
            name: `${existingDocRequest.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.FName || ''} ${existingDocRequest.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.LName || ''}`.trim(),
            designation: 'QA Officer',
            signature: existingDocRequest.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.signUrl || '',
            date: existingDocRequest.QaDoc_officerDate ? new Date(existingDocRequest.QaDoc_officerDate).toLocaleDateString() : '',
          };

          // Check edit permission based on existing doc request
          const canUserEdit = checkEditPermission(existingDocRequest, userRole, user?.Id ?? '');
          setCanEdit(canUserEdit);
        } else {
          // Allow editing for new request
          if (userRole === 'QA Associate' || userRole === 'Dept Manager') {
            setCanEdit(true);
          }
        }

        setForm(prev => {
          const newForm = { ...prev, ...loadedFormData };
          // Save original values for change detection
          originalFormRef.current = { ...newForm };
          return newForm;
        });
      } catch (err) {
        console.error('Error loading SOP header:', err);
        Swal.fire(String(t('messages.error')), String(t('messages.failedFetchDocument')), 'error');
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

    // Status 13, 14, 16, 17 - readonly for everyone (rejected or finalized)
    if ([13, 14, 16, 17].includes(status)) {
      return false;
    }

    // Status 12 (Approved by Dept Manager) - readonly for creator only
    if (status === 12 && docRequest.Requested_by === userId) {
      return false;
    }

    // Status 15 (Approved by QA Manager) - only QA DocumentOfficer can edit
    if (status === 15) {
      return role === 'QA DocumentOfficer';
    }

    switch (role) {
      case 'QA Associate':
        return docRequest.Requested_by === userId && (status === 8 || status === 9);
      case 'Dept Manager':
        return status === 9;
      case 'QA Manager':
        return status === 10 || status === 12; // QA Manager can edit after Dept Manager approval
      case 'QA DocumentOfficer':
        return status === 11 || status === 15; // QA DocumentOfficer can edit at status 11 and 15
      default:
        return false;
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

  // Check if current user is Dept Manager viewing a request at status 8
  const isDeptManagerViewingRequest = (): boolean => {
    if (userRole !== 'Dept Manager' || !docRequestForm) return false;
    // Must have either id (URL param) or headerId (query param)
    if (!id && !headerId) return false;
    // Check if the request is in status 8 (new request)
    if (docRequestForm.Request_status !== 8) return false;
    return true;
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

  // Should hide QA sections (for QA Associate and Dept Manager roles)
  const shouldHideQASections = (): boolean => {
    return userRole === 'QA Associate' || userRole === 'Dept Manager';
  };

  // Check if current user is QA Manager viewing a request at status 12 (approved by Dept Manager)
  const _isQAManagerViewingRequest = (): boolean => {
    if (userRole !== 'QA Manager' || !docRequestForm || !id) return false;
    // Check if the request is in status 12 (approved by dept manager, waiting for QA Manager)
    return docRequestForm.Request_status === 12;
  };
  void _isQAManagerViewingRequest; // Reserved for future use

  // Check if current user is QA Manager (for disabling certain sections)
  const isQAManagerViewing = (): boolean => {
    return userRole === 'QA Manager';
  };

  // Check if current user is QA Officer (for disabling certain sections)
  const isQAOfficerViewing = (): boolean => {
    return userRole === 'QA DocumentOfficer';
  };

  // Check if current user is QA Officer viewing a request at status 15 (approved by QA Manager)
  const _isQAOfficerViewingRequest = (): boolean => {
    if (userRole !== 'QA DocumentOfficer' || !docRequestForm || !id) return false;
    // Check if the request is in status 15 (approved by QA Manager, waiting for QA Officer)
    return docRequestForm.Request_status === 15;
  };
  void _isQAOfficerViewingRequest; // Reserved for future use

  // Handle Dept Manager approval/rejection
  const handleDeptManagerAction = async (action: 'approve' | 'reject') => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const newStatus = action === 'approve' ? 12 : 13;
      const currentDate = new Date().toISOString();

      // Update doc request form status only (not SOP header)
      await axiosServices.post('/api/docrequest-form/addEdit', {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        Reviewed_by: user?.Id,
        Reviewed_date: currentDate,
      });

      // Update local form state with manager data
      setForm(prev => ({
        ...prev,
        reviewed: {
          name: `${user?.FName || ''} ${user?.LName || ''}`.trim(),
          designation: 'Department Manager',
          signature: user?.signUrl || '',
          date: new Date().toLocaleDateString(),
        },
      }));

      const message = action === 'approve' ? String(t('messages.requestApprovedSuccess')) : String(t('messages.requestRejectedSuccess'));
      Swal.fire(String(t('messages.success')), message, 'success').then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire(String(t('messages.error')), String(t('messages.errorUpdatingStatus')), 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle QA Manager approval/rejection
  const handleQAManagerAction = async (action: 'approve' | 'reject') => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const newStatus = action === 'approve' ? 15 : 14;
      const currentDate = new Date().toISOString();

      // Update doc request form status only (not SOP header)
      await axiosServices.post('/api/docrequest-form/addEdit', {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        QaMan_Id: user?.Id,
        QaManApprove_Date: currentDate,
        Qa_comment: form.qaComment,
      });

      // Update local form state with QA Manager data
      setForm(prev => ({
        ...prev,
        qaManager: {
          name: `${user?.FName || ''} ${user?.LName || ''}`.trim(),
          designation: 'QA Manager',
          signature: user?.signUrl || '',
          date: new Date().toLocaleDateString(),
        },
      }));

      // Send notifications when approved (status 15)
      if (action === 'approve') {
        const docTitle = form.docTitle || docRequestForm.Sop_header?.Doc_Title_en || 'Document';
        const qaManagerName = `${user?.FName || ''} ${user?.LName || ''}`.trim();

        // 1. Notify QA DocumentOfficer(s)
        try {
          const qaOfficerRes = await axiosServices.get('/api/users/getUsersByRole/QA DocumentOfficer');
          const qaOfficers = Array.isArray(qaOfficerRes.data) ? qaOfficerRes.data : [];
          for (const officer of qaOfficers) {
            if (officer.Id) {
              await sendNotification(
                officer.Id,
                `Document request "${docTitle}" has been approved by QA Manager "${qaManagerName}" and is waiting for your review.`,
                { docRequestId: docRequestForm.Id, docTitle, sopHeaderId: docRequestForm.sop_HeaderId }
              );
            }
          }
        } catch (err) {
          console.error('Error notifying QA DocumentOfficer:', err);
        }

        // 2. Notify the user who created the request
        if (docRequestForm.Requested_by) {
          try {
            await sendNotification(
              docRequestForm.Requested_by,
              `Your document request "${docTitle}" has been approved by QA Manager "${qaManagerName}".`,
              { docRequestId: docRequestForm.Id, docTitle, sopHeaderId: docRequestForm.sop_HeaderId }
            );
          } catch (err) {
            console.error('Error notifying request creator:', err);
          }
        }

        // 3. Notify the Dept Manager who approved the request
        if (docRequestForm.Reviewed_by) {
          try {
            await sendNotification(
              docRequestForm.Reviewed_by,
              `Document request "${docTitle}" that you approved has been accepted by QA Manager "${qaManagerName}".`,
              { docRequestId: docRequestForm.Id, docTitle, sopHeaderId: docRequestForm.sop_HeaderId }
            );
          } catch (err) {
            console.error('Error notifying Dept Manager:', err);
          }
        }
      }

      const message = action === 'approve' ? String(t('messages.requestApprovedSuccess')) : String(t('messages.requestRejectedSuccess'));
      Swal.fire(String(t('messages.success')), message, 'success').then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire(String(t('messages.error')), String(t('messages.errorUpdatingStatus')), 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle QA Officer approval/rejection
  const _handleQAOfficerAction = async (action: 'approve' | 'reject') => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const newStatus = action === 'approve' ? 16 : 17;
      const currentDate = new Date().toISOString();

      // Update doc request form status only (not SOP header)
      await axiosServices.post('/api/docrequest-form/addEdit', {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        QaDoc_officerId: user?.Id,
        QaDoc_officerDate: currentDate,
      });

      // Update local form state with QA Officer data
      setForm(prev => ({
        ...prev,
        docOfficer: {
          name: `${user?.FName || ''} ${user?.LName || ''}`.trim(),
          designation: 'QA Officer',
          signature: user?.signUrl || '',
          date: new Date().toLocaleDateString(),
        },
      }));

      const message = action === 'approve' ? String(t('messages.requestApprovedSuccess')) : String(t('messages.requestRejectedSuccess'));
      Swal.fire(String(t('messages.success')), message, 'success').then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire(String(t('messages.error')), String(t('messages.errorUpdatingStatus')), 'error');
    } finally {
      setSubmitLoading(false);
    }
  };
  void _handleQAOfficerAction; // Reserved for future use

  const handleStatusUpdate = async (newStatus: number, additionalData: any = {}) => {
    if (!docRequestForm) return;

    setSubmitLoading(true);
    try {
      const payload: any = {
        Id: docRequestForm.Id,
        Request_status: newStatus,
        ...additionalData,
      };

      // إضافة بيانات التوقيع حسب الدور (update request form only, not SOP header)
      if (userRole === 'Dept Manager' && newStatus === 10) {
        payload.Reviewed_by = user?.Id;
        payload.Reviewed_date = new Date().toISOString();
      } else if (userRole === 'QA Manager' && newStatus === 11) {
        payload.QaMan_Id = user?.Id;
        payload.QaManApprove_Date = new Date().toISOString();
      } else if (userRole === 'QA DocumentOfficer' && (newStatus === 16 || newStatus === 17)) {
        payload.QaDoc_officerId = user?.Id;
        payload.QaDoc_officerDate = new Date().toISOString();
      }

      await axiosServices.post('/api/docrequest-form/addEdit', payload);

      Swal.fire(String(t('messages.success')), String(t('messages.statusUpdatedSuccess')), 'success').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire(String(t('messages.error')), String(t('messages.errorUpdatingStatus')), 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper function to save scope and purpose (only if changed)
  const saveScopeAndPurpose = async (
    sopHeaderId: string,
    changedSections: { purpose: boolean; scope: boolean }
  ) => {
    // Save Purpose only if changed
    if (changedSections.purpose && (form.purposeEn || form.purposeAr)) {
      setSubmitStatus(`⏳ ${t('messages.savingPurpose')}`);
      await axiosServices.post('/api/soppurpose/addSop-Purpose', {
        Content_en: form.purposeEn,
        Content_ar: form.purposeAr,
        Is_Current: 1,
        Is_Active: 1,
        Sop_HeaderId: sopHeaderId,
      });
    }

    // Save Scope only if changed
    if (changedSections.scope && (form.scopeEn || form.scopeAr)) {
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

      // Add user signature to form when submitting a new request (including headerId case from SOPCard)
      // This covers: new request (!id && !docRequestForm) OR from SOPCard (headerId && !id)
      if (!docRequestForm && (!id || headerId)) {
        setForm(prev => ({
          ...prev,
          requested: {
            ...prev.requested,
            signature: user?.signUrl || '',
          },
        }));
      }

      // Detect which sections have changed
      const changedSections = getChangedSections();
      const hasAnyChanges = changedSections.header || changedSections.purpose ||
                           changedSections.scope || changedSections.docRequest;

      if (docRequestForm) {
        // تحديث طلب موجود - only update changed sections
        if (!hasAnyChanges) {
          Swal.fire(String(t('messages.info')), String(t('messages.noChangesToSave') || 'No changes to save'), 'info');
          setSubmitLoading(false);
          return;
        }

        // Update Doc Request Form only if docRequest section changed
        if (changedSections.docRequest) {
          setSubmitStatus(`⏳ ${t('messages.updatingRequest')}`);
          const payload = {
            Id: docRequestForm.Id,
            Qa_comment: form.qaComment,
            Doc_type: form.docType,
          };
          await axiosServices.post('/api/docrequest-form/addEdit', payload);
        }

        // تحديث SOP Header only if header section changed
        if (changedSections.header) {
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
        }

        // Save scope and purpose (only changed sections)
        await saveScopeAndPurpose(docRequestForm.sop_HeaderId, changedSections);

        // Update original form ref after successful save
        originalFormRef.current = { ...form };
      } else if (headerId) {
        // تحديث SOP موجود (من SOPCard navigation)
        // For new request from SOPCard, update header if changed
        if (changedSections.header) {
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
        }

        // Save scope and purpose (only changed sections)
        await saveScopeAndPurpose(headerId, changedSections);

        // إنشاء طلب المستند إذا لم يكن موجوداً
        setSubmitStatus(`⏳ ${t('messages.creatingRequest')}`);
        const docRequestPayload = {
          sop_HeaderId: headerId,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
          Request_status: 8,
          Requested_by: user?.Id,
          Request_date: new Date().toISOString(),
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

        // If QA Associate submits for header with status 16 or 1, update status to 2 and notify QA Supervisor
        const statusNum = Number(sopHeaderStatus);
        if (userRole === 'QA Associate' && (statusNum === 16 || statusNum === 1)) {
          // Update SOP header status to 2
          await axiosServices.post('/api/sopheader/addEditSopHeader', {
            Id: headerId,
            status: '2',
          });

          // Send notification to QA Supervisor(s) in the same company
          try {
            const qaSupervisorRes = await axiosServices.get('/api/users/getUsersByRole/QA Supervisor');
            const qaSupervisors = Array.isArray(qaSupervisorRes.data) ? qaSupervisorRes.data : [];
            const employeeName = `${user?.FName || ''} ${user?.LName || ''}`.trim();

            for (const supervisor of qaSupervisors) {
              // Check if supervisor is in the same company
              const supervisorCompId = supervisor.compId ||
                supervisor.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.Department_Data?.comp_ID;
              if (supervisor.Id && supervisorCompId === compId) {
                await sendNotification(
                  supervisor.Id,
                  `Document "${form.docTitle}" has been submitted by QA Associate "${employeeName}" and is waiting for your review.`,
                  { sopHeaderId: headerId, docTitle: form.docTitle, requestedBy: user?.Id }
                );
              }
            }
          } catch (err) {
            console.error('Error notifying QA Supervisor:', err);
          }
        }
      } else {
        // إنشاء طلب جديد - all sections are saved for new documents
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
          throw new Error('failed to Create Document');
        }

        // Save scope and purpose (all sections for new document)
        await saveScopeAndPurpose(newHeaderId, { purpose: true, scope: true });

        // إنشاء طلب المستند
        setSubmitStatus(`⏳ ${t('messages.creatingRequest')}`);
        const docRequestPayload = {
          sop_HeaderId: newHeaderId,
          Qa_comment: form.qaComment,
          Doc_type: form.docType,
          Request_status: 8,
          Requested_by: user?.Id,
          Request_date: new Date().toISOString(),
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

      Swal.fire(String(t('messages.success')), String(t('messages.dataSavedSuccess')), 'success').then(() => {
        if (!id) {
          navigate(-1);
        } else {
          window.location.reload();
        }
      });

    } catch (err: any) {
      console.error(err);
      Swal.fire(String(t('messages.error')), `${t('messages.errorSaving')}: ${err.response?.data?.message || err.message}`, 'error');
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
            {t('buttons.managerApproval')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleStatusUpdate(13)}
            disabled={submitLoading}
          >
            {t('buttons.rejectRequest')}
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
            {t('buttons.qaManagerApproval')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleStatusUpdate(14)}
            disabled={submitLoading}
          >
            {t('buttons.rejectRequest')}
          </Button>
        </Stack>
      );
    }

    if (userRole === 'QA DocumentOfficer' && status === 15) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleStatusUpdate(16)}
            disabled={submitLoading}
          >
            {t('accept')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleStatusUpdate(17)}
            disabled={submitLoading}
          >
            {t('buttons.reject')}
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
            {t('buttons.sendRequest')}
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
              {getStatusSteps().filter(step => ![13, 14, 17].includes(step.status)).map((step, index) => {
                // Determine if this step should show error styling
                const isRejectedByDeptManager = docRequestForm.Request_status === 13 && index <= 1;
                const isRejectedByQAManager = docRequestForm.Request_status === 14 && index <= 2;
                const isRejectedByQAOfficer = docRequestForm.Request_status === 17 && index <= 3;
                const showErrorStyle = isRejectedByDeptManager || isRejectedByQAManager || isRejectedByQAOfficer;
                const showErrorLabel = (docRequestForm.Request_status === 13 && index === 1) ||
                                       (docRequestForm.Request_status === 14 && index === 2) ||
                                       (docRequestForm.Request_status === 17 && index === 3);

                return (
                  <Step
                    key={step.status}
                    sx={showErrorStyle ? {
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: 'error.main',
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: 'error.main',
                      },
                      '& .MuiStepIcon-root.Mui-completed': {
                        color: 'error.main',
                      },
                      '& .MuiStepIcon-root.Mui-active': {
                        color: 'error.main',
                      },
                    } : {}}
                  >
                    <StepLabel error={showErrorLabel}>
                      {step.label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {[13, 14, 17].includes(docRequestForm.Request_status) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {t('documentRequest.requestRejected')}
              </Alert>
            )}
          </Paper>
        )}

        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ flex: 1 }} />
              <Box textAlign="center" sx={{ flex: 2 }}>
                <Typography variant="h4">
                  {id ? t('documentRequest.viewTitle') : t('documentRequest.title')}
                </Typography>
                {docRequestForm && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {t('documentRequest.requestNumber')}: {docRequestForm.RequestFrm_code}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                {(id || docRequestForm) && (
                  <Button
                    variant="outlined"
                    startIcon={<IconPrinter />}
                    onClick={() => {
                      const printUrl = id
                        ? `/documentation-control/Request_Form_Print/${id}`
                        : `/documentation-control/Request_Form_Print?headerId=${docRequestForm?.sop_HeaderId}`;
                      window.open(printUrl, '_blank');
                    }}
                  >
                    {t('Print Preview')}
                  </Button>
                )}
              </Box>
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

            {/* الغرض والنطاق - للعرض فقط للـ Dept Manager, QA Manager, QA Officer */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>{t('documentRequest.purposeEn')}:</Typography>
                <RichTextEditor
                  value={form.purposeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeEn: content }))}
                  disabled={!canEdit || isDeptManagerViewingRequest() || isQAManagerViewing() || isQAOfficerViewing()}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>الغرض:</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.purposeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, purposeAr: content }))}
                  disabled={!canEdit || isDeptManagerViewingRequest() || isQAManagerViewing() || isQAOfficerViewing()}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" mb={1}>{t('documentRequest.scopeEn')}:</Typography>
                <RichTextEditor
                  value={form.scopeEn}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeEn: content }))}
                  disabled={!canEdit || isDeptManagerViewingRequest() || isQAManagerViewing() || isQAOfficerViewing()}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ direction: 'rtl' }}>
                <Typography fontWeight="bold" mb={1} sx={{ textAlign: 'right' }}>مجال التطبيق:</Typography>
                <RichTextEditor
                  language="ar"
                  dir="rtl"
                  value={form.scopeAr}
                  onChange={(content: string) => setForm(prev => ({ ...prev, scopeAr: content }))}
                  disabled={!canEdit || isDeptManagerViewingRequest() || isQAManagerViewing() || isQAOfficerViewing()}
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
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Designation')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.designation}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Designation')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.reviewed.designation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Signature')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.requested.signature && (
                        <img src={form.requested.signature} alt={String(t('documentRequest.signature'))} style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('signature')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>
                      {form.reviewed.signature && (
                        <img src={form.reviewed.signature} alt={String(t('documentRequest.signature'))} style={{ maxHeight: 50 }} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('date')}</TableCell>
                    <TableCell sx={{ bgcolor: '#fafafa' }}>{form.requested.date}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('date')}</TableCell>
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

            {/* QA Manager Action Buttons - Hidden for QA Manager as per requirements */}
            {/* Buttons are hidden when QA Manager views the form */}

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

                {/* QA Manager Accept/Reject Buttons */}
                {isQAManagerViewing() && docRequestForm && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={() => handleQAManagerAction('approve')}
                        disabled={submitLoading}
                      >
                        {t('accept')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={() => handleQAManagerAction('reject')}
                        disabled={submitLoading}
                      >
                        {t('buttons.reject')}
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* Document Option Radio Buttons */}
                <Box mb={3}>
                  <Typography fontWeight="bold" mb={1}>{t('documentRequest.documentOption')}:</Typography>
                  <RadioGroup
                    row
                    value={documentOption}
                    onChange={(e) => {
                      setDocumentOption(e.target.value as 'new' | 'merge');
                      if (e.target.value === 'new') {
                        setSelectedSopCode('');
                      }
                    }}
                  >
                    <FormControlLabel
                      value="merge"
                      control={<Radio />}
                      label={t('documentRequest.mergeWithExisting')}
                      disabled={!canEdit && userRole !== 'QA Manager'}
                    />
                    <FormControlLabel
                      value="new"
                      control={<Radio />}
                      label={t('documentRequest.newDocument')}
                      disabled={!canEdit && userRole !== 'QA Manager'}
                    />
                  </RadioGroup>

                  {/* Dropdown for selecting existing SOP code when merge is selected */}
                  {documentOption === 'merge' && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="sop-code-label">{t('documentRequest.selectSopCode')}</InputLabel>
                      <Select
                        labelId="sop-code-label"
                        value={selectedSopCode}
                        label={t('documentRequest.selectSopCode')}
                        onChange={(e) => setSelectedSopCode(e.target.value)}
                        disabled={!canEdit && userRole !== 'QA Manager'}
                      >
                        {sopCodes.length > 0 ? (
                          sopCodes.map((sop) => (
                            <MenuItem key={sop.Id} value={sop.Id}>
                              {sop.Doc_Code} - {sop.Doc_Title_en}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>{t('documentRequest.noSopCodes')}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
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
                            <img src={form.qaManager.signature} alt={String(t('documentRequest.signature'))} style={{ maxHeight: 50 }} />
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('documentRequest.signature')}</TableCell>
                        <TableCell sx={{ bgcolor: '#fafafa' }}>
                          {form.docOfficer.signature && (
                            <img src={form.docOfficer.signature} alt={String(t('documentRequest.signature'))} style={{ maxHeight: 50 }} />
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
              </Box>
            )}
          </Paper>
        </form>
      </Container>
    </>
  );
};

export default DocumentRequestManagement;
