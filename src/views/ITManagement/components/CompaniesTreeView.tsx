// src/views/ITManagement/components/CompaniesTreeView.tsx

import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// أيقونات مختلفة لتمييز العناصر
import BusinessIcon from '@mui/icons-material/Business';                 // للشركة
import ApartmentIcon from '@mui/icons-material/Apartment';              // للقسم الرئيسي
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'; // للقسم الفرعي

import { ICompany, IDepartment, statusToText } from '../types';
import axiosServices from 'src/utils/axiosServices';

/** واجهة الـ Props التي يتلقاها هذا المكوّن */
interface Props {
  companies: ICompany[];
  onSelectNode: (event: React.SyntheticEvent, nodeId: string) => void;
  onOpenCompanyDialog: (company?: ICompany) => void;
  onOpenDepartmentDialog: (companyId: string, department?: IDepartment) => void;
  onOpenSubDepartmentDialog: (companyId: string, parentDeptId: string) => void;
  fetchCompanies: () => void;
}

/**
 * مكوّن يعرض شجرة (TreeView) تحتوي على الشركات (Companies) وأقسامها (Departments).
 * يمكن التمييز بين شركة وقسم وقسم فرعي باستخدام أيقونات وألوان مختلفة.
 */
const CompaniesTreeView: React.FC<Props> = ({
  companies,
  onSelectNode,
  onOpenCompanyDialog,
  onOpenDepartmentDialog,
  onOpenSubDepartmentDialog,
  fetchCompanies,
}) => {

  // حذف شركة
  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Do you want to delete this company?')) return;
    try {
      await axiosServices.delete(`/api/companies/deleteCompany/${companyId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // حذف قسم
  const handleDeleteDepartment = async (departmentId: string) => {
    if (!window.confirm('Do you want to delete this department?')) return;
    try {
      await axiosServices.delete(`/api/department/department/${departmentId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  /**
   * رسم الأقسام (Departments) بشكل شجري، مع أيقونة خاصة بالقسم الرئيسي والقسم الفرعي
   */
  const renderDepartmentNodes = (departments: IDepartment[], companyId: string) => {
    return departments.map((dept) => {
      const deptStatus = statusToText(dept.Is_Active);
      
      // هل القسم فرعي؟ (أي له قسم أب Head_Department غير null)
      const isSubDept = !!dept.Head_Department;
      // نختار الأيقونة بناء على إن كان فرعي أم رئيسي
      const deptIcon = isSubDept
        ? <SubdirectoryArrowRightIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
        : <ApartmentIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />;

      const deptLabel = (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" alignItems="center">
            {deptIcon}
            <Typography component="span" fontWeight="bold">
              {dept.Dept_name}
            </Typography>
            <Typography component="span" ml={1} color="text.secondary" fontSize="0.9rem">
              ({deptStatus})
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} ml={2}>
            {/* تعديل قسم */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDepartmentDialog(companyId, dept);
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>

            {/* حذف قسم */}
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDepartment(dept.Id);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>

            {/* إضافة قسم فرعي */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSubDepartmentDialog(companyId, dept.Id);
              }}
            >
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

  /**
   * رسم الشركات (Companies) مع أيقونة مميزة
   */
  const renderCompanyNodes = () => {
    return companies.map((company) => {
      const compStatus = statusToText(company.Is_Active);

      // أيقونة الشركة
      const companyIcon = (
        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
      );

      const companyLabel = (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center">
            {companyIcon}
            <Typography component="span" fontWeight="bold">
              {company.Name}
            </Typography>
            <Typography component="span" ml={1} color="text.secondary" fontSize="0.9rem">
              ({compStatus})
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} ml={2}>
            {/* تعديل شركة */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCompanyDialog(company);
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>

            {/* حذف شركة */}
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCompany(company.Id);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>

            {/* إضافة قسم */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDepartmentDialog(company.Id);
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
      );

      // الأقسام ذات المستوى الأعلى (Head_Department=null)
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
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onSelectNode}
    >
      {renderCompanyNodes()}
    </TreeView>
  );
};

export default CompaniesTreeView;
