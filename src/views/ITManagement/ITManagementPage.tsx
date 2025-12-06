// src/views/ITManagement/ITManagementPage.tsx

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

import axiosServices from 'src/utils/axiosServices';

import { ICompany, IDepartment, IUserData, IUserRole, SelectedItemType } from './types';
import CompaniesTreeView from './components/CompaniesTreeView';
import SidebarDetails from './components/SidebarDetails';
import AddEditCompanyDialog from './components/AddEditCompanyDialog';
import AddEditDepartmentDialog from './components/AddEditDepartmentDialog';
import AssignUserDialog from './components/AssignUserDialog';

/** الصفحة الرئيسية لإدارة الشركات والأقسام */
const ITManagementPage: React.FC = () => {
  // ============ حالات التخزين الرئيسية ============
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [allUsers, setAllUsers] = useState<IUserData[]>([]);
  const [allRoles, setAllRoles] = useState<IUserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // العنصر المختار في الشجرة (شركة أو قسم)
  const [selectedItem, setSelectedItem] = useState<ICompany | IDepartment | null>(null);
  const [selectedType, setSelectedType] = useState<SelectedItemType>(null);

  // ============ حوارات الشركة ============
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [companyData, setCompanyData] = useState<Partial<ICompany>>({});

  // ============ حوارات القسم ============
  const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
  const [departmentData, setDepartmentData] = useState<Partial<IDepartment>>({});
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [parentDepartmentId, setParentDepartmentId] = useState<string | null>(null);

  // ============ حوار تعيين مستخدم ============
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignData, setAssignData] = useState<{
    userId?: string;
    departmentId?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    userRoleId?: string;
  }>({});

  // ================== جلب البيانات ==================
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCompanies(), fetchUsers(), fetchRoles()]);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axiosServices.get('/api/companies/getAllCompanies');
      setCompanies(res.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosServices.get('/api/users/getUsers');
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosServices.get('/api/userRole/getAll');
      setAllRoles(res.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // ================== اختيارات الشجرة ==================
  /** عند اختيار العقدة في الشجرة */
  const handleSelectNode = async (_event: React.SyntheticEvent, nodeId: string) => {
    // هل هو شركة؟
    const isCompany = companies.some((c) => c.Id === nodeId);
    if (isCompany) {
      const comp = companies.find((c) => c.Id === nodeId);
      if (comp) {
        setSelectedItem(comp);
        setSelectedType('company');
      }
    } else {
      // إذن قسم => نجلب تفاصيله باستخدام المسار الصحيح
      try {
        const response = await axiosServices.get(`/api/department/getdepartment/${nodeId}`);
        setSelectedItem(response.data);
        setSelectedType('department');
      } catch (err) {
        console.error('Error fetching department details:', err);
      }
    }
  };

  // ================== حوارات الشركة (إضافة/تعديل) ==================
  const handleOpenCompanyDialog = (company?: ICompany) => {
    if (company) setCompanyData(company);
    else setCompanyData({});
    setOpenCompanyDialog(true);
  };
  const handleCloseCompanyDialog = () => setOpenCompanyDialog(false);

  // ================== حوارات القسم (إضافة/تعديل) ==================
  const handleOpenDepartmentDialog = (companyId: string, department?: IDepartment) => {
    setSelectedCompanyId(companyId);
    setParentDepartmentId(null);
    if (department) setDepartmentData(department);
    else setDepartmentData({});
    setOpenDepartmentDialog(true);
  };
  const handleOpenSubDepartmentDialog = (companyId: string, parentDeptId: string) => {
    setSelectedCompanyId(companyId);
    setParentDepartmentId(parentDeptId);
    setDepartmentData({});
    setOpenDepartmentDialog(true);
  };
  const handleCloseDepartmentDialog = () => setOpenDepartmentDialog(false);

  // ================== حوار تعيين مستخدم ==================
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
  const handleCloseAssignDialog = () => setOpenAssignDialog(false);

  // ================== حذف مستخدم من واجهة القسم (بدون API) ==================
  const handleRemoveUserFromDept = (userId: string) => {
    alert('Remove user endpoint not implemented in backend! We remove from UI only.');
    if (selectedType === 'department' && selectedItem && 'users' in selectedItem) {
      const updatedUsers = selectedItem.users?.filter((u) => u.Id !== userId) || [];
      const updatedDept = { ...selectedItem, users: updatedUsers };
      setSelectedItem(updatedDept);
    }
  };

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

  return (
    <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
      {/* الشجرة في اليسار */}
      <Box sx={{ flex: 1, border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
        <Typography variant="h4" mb={2}>
          Full Companies & Departments Management
        </Typography>

        <Button variant="contained" onClick={() => handleOpenCompanyDialog()} sx={{ mb: 2 }}>
          Add new company
        </Button>

        <CompaniesTreeView
          companies={companies}
          onSelectNode={handleSelectNode}
          onOpenCompanyDialog={handleOpenCompanyDialog}
          onOpenDepartmentDialog={handleOpenDepartmentDialog}
          onOpenSubDepartmentDialog={handleOpenSubDepartmentDialog}
          fetchCompanies={fetchCompanies}
        />
      </Box>

      {/* Sidebar لعرض التفاصيل */}
      <Box sx={{ width: 400, border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
        <SidebarDetails
          selectedItem={selectedItem}
          selectedType={selectedType}
          companies={companies}
          onOpenCompanyDialog={handleOpenCompanyDialog}
          onOpenDepartmentDialog={handleOpenDepartmentDialog}
          onOpenAssignDialog={handleOpenAssignDialog}
          onRemoveUser={handleRemoveUserFromDept}
        />
      </Box>

      {/* حوار الشركة */}
      <AddEditCompanyDialog
        open={openCompanyDialog}
        onClose={handleCloseCompanyDialog}
        fetchCompanies={fetchCompanies}
        companyData={companyData}
        setCompanyData={setCompanyData}
        // نمرر selectedItem فقط إذا كان العنصر المختار شركة
        selectedItem={selectedType === 'company' ? (selectedItem as ICompany) : null}
        selectedType={selectedType}
        companies={companies}
        setCompanies={setCompanies}
      />

      {/* حوار القسم */}
      <AddEditDepartmentDialog
        open={openDepartmentDialog}
        onClose={handleCloseDepartmentDialog}
        fetchCompanies={fetchCompanies}
        departmentData={departmentData}
        setDepartmentData={setDepartmentData}
        selectedItem={selectedItem}
        selectedType={selectedType}
        setSelectedItem={setSelectedItem}
        selectedCompanyId={selectedCompanyId}
        parentDepartmentId={parentDepartmentId}
        setParentDepartmentId={setParentDepartmentId}
      />

      {/* حوار تعيين المستخدم */}
      <AssignUserDialog
        open={openAssignDialog}
        onClose={handleCloseAssignDialog}
        assignData={assignData}
        setAssignData={setAssignData}
        allUsers={allUsers}
        allRoles={allRoles}
        fetchCompanies={fetchCompanies}
        selectedItem={selectedItem}
        selectedType={selectedType}
        setSelectedItem={setSelectedItem}
      />
    </Box>
  );
};

export default ITManagementPage;
