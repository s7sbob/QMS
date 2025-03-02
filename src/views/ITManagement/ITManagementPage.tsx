import React, { useEffect, useState, FormEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';

// TreeView-related imports from MUI
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { IconInfoCircle } from '@tabler/icons-react';

import axiosServices from 'src/utils/axiosServices';

/** واجهات (Interfaces) بناءً على البيانات في سؤالك */
interface IUserData {
  Id: string;
  FName: string;
  LName: string;
  DateOfBirth?: string;
  CrtDate?: string;
  UserName: string;
  Password?: string;
  Email: string;
  userImg_Url?: string;
  is_Active: number;
}

interface IDepartment {
  Id: string;
  Dept_name: string;
  address?: string;
  Gps_lat?: string;
  Gps_long?: string;
  Dept_manager?: string;
  Dept_PhoneNumber1?: string;
  Dept_phoneNumber2?: string;
  Head_Department: string | null;
  crt_date?: string;
  crt_by?: string | null;
  Modified_date?: string | null;
  Modified_By?: string | null;
  email?: string;
  comp_ID?: string;
  Is_Active: number;
  other_Department_Data?: IDepartment[];
}

interface ICompany {
  Id: string;
  Name: string;
  address?: string;
  Gps_Lat?: string;
  Gps_long?: string;
  Commercial_Reg_Number?: string;
  Tax_Id_Number?: string;
  Commercial_Img_Url?: string;
  TaxId_Img_Url?: string;
  Ceo_id?: string;
  Is_Active: number;
  User_Data?: IUserData; // بيانات الـ CEO مثلا
  departments?: IDepartment[];
  ceo?: IUserData; // أحياناً
}

/** دالة تحويل 1 أو 0 إلى نص */
function statusToText(isActive: number): string {
  return isActive === 1 ? 'Active' : 'Inactive';
}

const ITManagementPage: React.FC = () => {
  // حالات تخزين البيانات الرئيسية
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [allUsers, setAllUsers] = useState<IUserData[]>([]);

  // تحميل البيانات من الـ Backend
  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axiosServices.get('/api/companies/getAllCompanies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosServices.get('/api/users/');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // =====================================
  // *** حوارات الشركة (عرض/تحرير) ***
  // =====================================
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [companyData, setCompanyData] = useState<Partial<ICompany>>({});

  const handleOpenCompanyDialog = (company?: ICompany) => {
    if (company) {
      setCompanyData(company);
    } else {
      // إضافة جديدة
      setCompanyData({});
    }
    setOpenCompanyDialog(true);
  };

  const handleCloseCompanyDialog = () => {
    setOpenCompanyDialog(false);
  };

  const handleSaveCompany = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // نمرر جميع الحقول
      await axiosServices.post('/api/companies/addEditCompany', {
        ...companyData,
        Is_Active: companyData.Is_Active ?? 1,
      });
      fetchCompanies();
      handleCloseCompanyDialog();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Do you want to delete this company?')) return;
    try {
      await axiosServices.delete(`/api/companies/deleteCompany/${companyId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // =====================================
  // *** حوارات القسم (عرض/تحرير) ***
  // =====================================
  const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
  const [departmentData, setDepartmentData] = useState<Partial<IDepartment>>({});
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [parentDepartmentId, setParentDepartmentId] = useState<string | null>(null);

  const handleOpenDepartmentDialog = (companyId: string, department?: IDepartment) => {
    setSelectedCompanyId(companyId);
    setParentDepartmentId(null);
    if (department) {
      setDepartmentData(department);
    } else {
      setDepartmentData({});
    }
    setOpenDepartmentDialog(true);
  };

  const handleOpenSubDepartmentDialog = (companyId: string, parentDeptId: string) => {
    setSelectedCompanyId(companyId);
    setParentDepartmentId(parentDeptId);
    setDepartmentData({});
    setOpenDepartmentDialog(true);
  };

  const handleCloseDepartmentDialog = () => {
    setOpenDepartmentDialog(false);
  };

  const handleSaveDepartment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosServices.post('/api/department/addEditDepartment', {
        ...departmentData,
        Is_Active: departmentData.Is_Active ?? 1,
        Head_Department: parentDepartmentId || departmentData.Head_Department || null,
        comp_ID: selectedCompanyId,
      });
      fetchCompanies();
      handleCloseDepartmentDialog();
      setParentDepartmentId(null);
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!window.confirm('Do you want to delete this department?')) return;
    try {
      await axiosServices.delete(`/api/department/department/${departmentId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  // =====================================
  // *** حوار تعيين مستخدم لقسم ***
  // =====================================
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignData, setAssignData] = useState<{
    userId?: string;
    departmentId?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    userRoleId?: string;
  }>({});

  const handleOpenAssignDialog = (departmentId: string) => {
    setAssignData({
      userId: '',
      departmentId,
      jobTitle: '',
      startDate: '',
      endDate: '',
      userRoleId: '',
    });
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleSaveAssign = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosServices.post('/api/department/department/assign-user', {
        userId: assignData.userId,
        departmentId: assignData.departmentId,
        userRoleId: assignData.userRoleId,
        jobTitle: assignData.jobTitle,
        startDate: assignData.startDate,
        endDate: assignData.endDate || null,
      });
      fetchCompanies();
      handleCloseAssignDialog();
    } catch (error) {
      console.error('Error assigning user:', error);
    }
  };

  // =====================================
  // *** حوار المعلومات (أو للعرض فقط) ***
  // - هنا سنجعل الحقول قابلة للعرض فقط.
  // =====================================
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoType, setInfoType] = useState<'company' | 'department' | null>(null);
  const [infoData, setInfoData] = useState<any>({});

  const handleOpenInfoDialog = (item: ICompany | IDepartment, type: 'company' | 'department') => {
    setInfoData(item);
    setInfoType(type);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setInfoData({});
    setInfoType(null);
  };

  const handleEditFromInfo = () => {
    // نغلق نافذة الـ Info
    handleCloseInfoDialog();
    // نفتح حوار التحرير الأساسي
    if (infoType === 'company') {
      handleOpenCompanyDialog(infoData as ICompany);
    } else {
      // قسم => نحتاج companyId
      const dept = infoData as IDepartment;
      const companyId = dept.comp_ID || ''; // إذا كان موجودا
      handleOpenDepartmentDialog(companyId, dept);
    }
  };

  // =====================================
  // *** عرض البيانات بشكل شجري (TreeView) ***
  // =====================================
  const renderDepartmentNodes = (departments: IDepartment[], companyId: string) => {
    return departments.map((dept) => {
      const deptStatus = statusToText(dept.Is_Active);

      const deptLabel = (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {/* اسم القسم وحالته */}
          <Box>
            <Typography component="span" fontWeight="bold">
              {dept.Dept_name}
            </Typography>
            <Typography component="span" ml={1} color="text.secondary" fontSize="0.9rem">
              ({deptStatus})
            </Typography>
          </Box>
          {/* أزرار */}
          <Stack direction="row" spacing={1} ml={2}>
            {/* Info */}
            <IconButton size="small" onClick={() => handleOpenInfoDialog(dept, 'department')}>
              <IconInfoCircle size={16} />
            </IconButton>
            {/* Edit */}
            <IconButton size="small" onClick={() => handleOpenDepartmentDialog(companyId, dept)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
            {/* Delete */}
            <IconButton size="small" color="error" onClick={() => handleDeleteDepartment(dept.Id)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {/* Assign user */}
            <IconButton size="small" onClick={() => handleOpenAssignDialog(dept.Id)}>
              <GroupAddIcon fontSize="inherit" />
            </IconButton>
            {/* Add sub-dept */}
            <IconButton size="small" onClick={() => handleOpenSubDepartmentDialog(companyId, dept.Id)}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
      );

      return (
        <TreeItem key={dept.Id} nodeId={dept.Id} label={deptLabel}>
          {dept.other_Department_Data && dept.other_Department_Data.length > 0 && (
            renderDepartmentNodes(dept.other_Department_Data, companyId)
          )}
        </TreeItem>
      );
    });
  };

  const renderCompanyNodes = () => {
    return companies.map((company) => {
      const compStatus = statusToText(company.Is_Active);

      const companyLabel = (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box>
            <Typography component="span" fontWeight="bold">
              {company.Name}
            </Typography>
            <Typography component="span" ml={1} color="text.secondary" fontSize="0.9rem">
              ({compStatus})
            </Typography>
          </Box>
          {/* أزرار الشركة */}
          <Stack direction="row" spacing={1} ml={2}>
            {/* Info */}
            <IconButton size="small" onClick={() => handleOpenInfoDialog(company, 'company')}>
              <IconInfoCircle size={16} />
            </IconButton>
            {/* Edit */}
            <IconButton size="small" onClick={() => handleOpenCompanyDialog(company)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
            {/* Delete */}
            <IconButton size="small" color="error" onClick={() => handleDeleteCompany(company.Id)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {/* Add department */}
            <IconButton size="small" onClick={() => handleOpenDepartmentDialog(company.Id)}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
      );

      const topLevelDepts = (company.departments || []).filter(
        (d) => d.Head_Department === null
      );

      return (
        <TreeItem key={company.Id} nodeId={company.Id} label={companyLabel}>
          {topLevelDepts.length > 0
            ? renderDepartmentNodes(topLevelDepts, company.Id)
            : (
              <TreeItem
                nodeId={`${company.Id}-noDept`}
                label={<Typography color="text.secondary">No Departments</Typography>}
              />
            )
          }
        </TreeItem>
      );
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" mb={2}>
        Full Companies & Departments Management
      </Typography>

      {/* زر لإضافة شركة جديدة */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenCompanyDialog()}
        sx={{ mb: 2 }}
      >
        Add new company
      </Button>

      {/* عرض شجري */}
      <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1, maxHeight: '70vh', overflowY: 'auto' }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {renderCompanyNodes()}
        </TreeView>
      </Box>

      {/* Dialog (Add/Edit Company) - يحتوي على كل الحقول المحتملة */}
      <Dialog open={openCompanyDialog} onClose={handleCloseCompanyDialog} fullWidth maxWidth="sm">
        <DialogTitle>{companyData.Id ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <form onSubmit={handleSaveCompany}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              required
              value={companyData.Name || ''}
              onChange={(e) => setCompanyData({ ...companyData, Name: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={companyData.address || ''}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
            />
            <TextField
              label="GPS Lat"
              fullWidth
              margin="normal"
              value={companyData.Gps_Lat || ''}
              onChange={(e) => setCompanyData({ ...companyData, Gps_Lat: e.target.value })}
            />
            <TextField
              label="GPS Long"
              fullWidth
              margin="normal"
              value={companyData.Gps_long || ''}
              onChange={(e) => setCompanyData({ ...companyData, Gps_long: e.target.value })}
            />
            <TextField
              label="Commercial Reg #"
              fullWidth
              margin="normal"
              value={companyData.Commercial_Reg_Number || ''}
              onChange={(e) => setCompanyData({ ...companyData, Commercial_Reg_Number: e.target.value })}
            />
            <TextField
              label="Tax ID #"
              fullWidth
              margin="normal"
              value={companyData.Tax_Id_Number || ''}
              onChange={(e) => setCompanyData({ ...companyData, Tax_Id_Number: e.target.value })}
            />
            <TextField
              label="Commercial Image URL"
              fullWidth
              margin="normal"
              value={companyData.Commercial_Img_Url || ''}
              onChange={(e) => setCompanyData({ ...companyData, Commercial_Img_Url: e.target.value })}
            />
            <TextField
              label="Tax Image URL"
              fullWidth
              margin="normal"
              value={companyData.TaxId_Img_Url || ''}
              onChange={(e) => setCompanyData({ ...companyData, TaxId_Img_Url: e.target.value })}
            />
            <TextField
              label="CEO ID"
              fullWidth
              margin="normal"
              value={companyData.Ceo_id || ''}
              onChange={(e) => setCompanyData({ ...companyData, Ceo_id: e.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(companyData.Is_Active ?? 1) === 1}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, Is_Active: e.target.checked ? 1 : 0 })
                  }
                />
              }
              label="Active?"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCompanyDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog (Add/Edit Department) - يحتوي على كل الحقول المحتملة */}
      <Dialog open={openDepartmentDialog} onClose={handleCloseDepartmentDialog} fullWidth maxWidth="sm">
        <DialogTitle>{departmentData.Id ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <form onSubmit={handleSaveDepartment}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              required
              value={departmentData.Dept_name || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Dept_name: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={departmentData.address || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, address: e.target.value })}
            />
            <TextField
              label="GPS Lat"
              fullWidth
              margin="normal"
              value={departmentData.Gps_lat || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Gps_lat: e.target.value })}
            />
            <TextField
              label="GPS Long"
              fullWidth
              margin="normal"
              value={departmentData.Gps_long || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Gps_long: e.target.value })}
            />
            <TextField
              label="Manager"
              fullWidth
              margin="normal"
              value={departmentData.Dept_manager || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Dept_manager: e.target.value })}
            />
            <TextField
              label="Phone #1"
              fullWidth
              margin="normal"
              value={departmentData.Dept_PhoneNumber1 || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Dept_PhoneNumber1: e.target.value })}
            />
            <TextField
              label="Phone #2"
              fullWidth
              margin="normal"
              value={departmentData.Dept_phoneNumber2 || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Dept_phoneNumber2: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={departmentData.email || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, email: e.target.value })}
            />
            {/* التواريخ */}
            <TextField
              label="Created At"
              fullWidth
              margin="normal"
              value={departmentData.crt_date || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, crt_date: e.target.value })}
            />
            <TextField
              label="Created By"
              fullWidth
              margin="normal"
              value={departmentData.crt_by || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, crt_by: e.target.value })}
            />
            <TextField
              label="Modified At"
              fullWidth
              margin="normal"
              value={departmentData.Modified_date || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Modified_date: e.target.value })}
            />
            <TextField
              label="Modified By"
              fullWidth
              margin="normal"
              value={departmentData.Modified_By || ''}
              onChange={(e) => setDepartmentData({ ...departmentData, Modified_By: e.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(departmentData.Is_Active ?? 1) === 1}
                  onChange={(e) =>
                    setDepartmentData({ ...departmentData, Is_Active: e.target.checked ? 1 : 0 })
                  }
                />
              }
              label="Active?"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDepartmentDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog (Assign user) */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} fullWidth maxWidth="sm">
        <DialogTitle>Assign User to Department</DialogTitle>
        <form onSubmit={handleSaveAssign}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                label="Select User"
                required
                value={assignData.userId || ''}
                onChange={(e) => setAssignData({ ...assignData, userId: e.target.value })}
              >
                {allUsers.map((user) => (
                  <MenuItem key={user.Id} value={user.Id}>
                    {user.FName} {user.LName} ({user.UserName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Role ID"
              fullWidth
              margin="normal"
              value={assignData.userRoleId || ''}
              onChange={(e) => setAssignData({ ...assignData, userRoleId: e.target.value })}
            />
            <TextField
              label="Job Title"
              fullWidth
              margin="normal"
              required
              value={assignData.jobTitle || ''}
              onChange={(e) => setAssignData({ ...assignData, jobTitle: e.target.value })}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={assignData.startDate || ''}
              onChange={(e) => setAssignData({ ...assignData, startDate: e.target.value })}
            />
            <TextField
              label="End Date (optional)"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={assignData.endDate || ''}
              onChange={(e) => setAssignData({ ...assignData, endDate: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssignDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog (Info) لعرض البيانات بشكل للقراءة أو عرضي */}
      <InfoDialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        data={infoData}
        type={infoType}
        onEdit={handleEditFromInfo}
      />
    </Box>
  );
};

/** مكوّن Dialog لعرض البيانات (Read-Only) إن أردت، 
 *  ومع زر Edit للانتقال للحوار الآخر. 
 *  هنا سنضعه أقصر قليلاً، لكن ما دام أننا أضفنا كل الحقول في حوار التحرير،
 *  يمكنك أن تختار تكرارها في هذا الـ InfoDialog أو إلغائه. 
 */
interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  data: ICompany | IDepartment | any;
  type: 'company' | 'department' | null;
  onEdit: () => void;
}

function InfoDialog({ open, onClose, data, type, onEdit }: InfoDialogProps) {
  if (!type || !data) return null;

  const isCompany = type === 'company';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isCompany ? 'Company Details' : 'Department Details'}</DialogTitle>
      <DialogContent dividers>
        {isCompany ? (
          <Box>
            <Typography variant="body1"><strong>ID:</strong> {data.Id}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {data.Name}</Typography>
            <Typography variant="body1"><strong>Address:</strong> {data.address}</Typography>
            <Typography variant="body1"><strong>GPS Lat:</strong> {data.Gps_Lat}</Typography>
            <Typography variant="body1"><strong>GPS Long:</strong> {data.Gps_long}</Typography>
            <Typography variant="body1"><strong>Commercial #:</strong> {data.Commercial_Reg_Number}</Typography>
            <Typography variant="body1"><strong>Tax #:</strong> {data.Tax_Id_Number}</Typography>
            <Typography variant="body1"><strong>Commercial Img:</strong> {data.Commercial_Img_Url}</Typography>
            <Typography variant="body1"><strong>Tax Img:</strong> {data.TaxId_Img_Url}</Typography>
            <Typography variant="body1"><strong>CEO ID:</strong> {data.Ceo_id}</Typography>
            <Typography variant="body1"><strong>Is Active:</strong> {statusToText(data.Is_Active)}</Typography>
            {/* وغيرها من الحقول */}
          </Box>
        ) : (
          <Box>
            <Typography variant="body1"><strong>ID:</strong> {data.Id}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {data.Dept_name}</Typography>
            <Typography variant="body1"><strong>Address:</strong> {data.address}</Typography>
            <Typography variant="body1"><strong>GPS Lat:</strong> {data.Gps_lat}</Typography>
            <Typography variant="body1"><strong>GPS Long:</strong> {data.Gps_long}</Typography>
            <Typography variant="body1"><strong>Manager:</strong> {data.Dept_manager}</Typography>
            <Typography variant="body1"><strong>Phone #1:</strong> {data.Dept_PhoneNumber1}</Typography>
            <Typography variant="body1"><strong>Phone #2:</strong> {data.Dept_PhoneNumber2}</Typography>
            <Typography variant="body1"><strong>Head Dept:</strong> {data.Head_Department}</Typography>
            <Typography variant="body1"><strong>Created At:</strong> {data.crt_date}</Typography>
            <Typography variant="body1"><strong>Created By:</strong> {data.crt_by}</Typography>
            <Typography variant="body1"><strong>Modified At:</strong> {data.Modified_date}</Typography>
            <Typography variant="body1"><strong>Modified By:</strong> {data.Modified_By}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {data.email}</Typography>
            <Typography variant="body1"><strong>Is Active:</strong> {statusToText(data.Is_Active)}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onEdit}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ITManagementPage;
