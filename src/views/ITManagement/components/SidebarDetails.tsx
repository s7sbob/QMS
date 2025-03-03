// src/views/ITManagement/components/SidebarDetails.tsx

import React from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICompany, IDepartment, SelectedItemType, statusToText } from '../types';
import { findDepartmentNameById } from '../utils/findDepartmentName';

interface Props {
  selectedItem: ICompany | IDepartment | null;
  selectedType: SelectedItemType;
  companies: ICompany[];
  onOpenCompanyDialog: (company?: ICompany) => void;
  onOpenDepartmentDialog: (companyId: string, department?: IDepartment) => void;
  onOpenAssignDialog: (departmentId: string) => void;
  onRemoveUser: (userId: string, deptId: string) => void;
}

const SidebarDetails: React.FC<Props> = ({
  selectedItem,
  selectedType,
  companies,
  onOpenCompanyDialog,
  onOpenDepartmentDialog,
  onOpenAssignDialog,
  onRemoveUser,
}) => {
  if (!selectedItem) {
    return (
      <Typography variant="body2" color="text.secondary">
        Please select a company or department from the tree.
      </Typography>
    );
  }

  if (selectedType === 'company') {
    const comp = selectedItem as ICompany;
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Company Details</Typography>
        <Typography><strong>ID:</strong> {comp.Id}</Typography>
        <Typography><strong>Name:</strong> {comp.Name}</Typography>
        <Typography><strong>Address:</strong> {comp.address}</Typography>
        <Typography><strong>GPS Lat:</strong> {comp.Gps_Lat}</Typography>
        <Typography><strong>GPS Long:</strong> {comp.Gps_long}</Typography>
        <Typography><strong>Commercial #:</strong> {comp.Commercial_Reg_Number}</Typography>
        <Typography><strong>Tax #:</strong> {comp.Tax_Id_Number}</Typography>
        <Typography>
          <strong>Commercial Img:</strong> {comp.Commercial_Img_Url ? 'Uploaded' : 'N/A'}
        </Typography>
        <Typography>
          <strong>Tax Img:</strong> {comp.TaxId_Img_Url ? 'Uploaded' : 'N/A'}
        </Typography>
        <Typography><strong>CEO ID:</strong> {comp.Ceo_id}</Typography>
        <Typography><strong>Is Active:</strong> {statusToText(comp.Is_Active)}</Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={() => onOpenCompanyDialog(comp)}>
            Edit Company
          </Button>
        </Box>
      </Box>
    );
  }

  if (selectedType === 'department') {
    const dept = selectedItem as IDepartment;
    const headDeptName = dept.Head_Department
      ? findDepartmentNameById(companies, dept.Head_Department)
      : 'N/A';

    return (
      <Box>
        <Typography variant="h6" gutterBottom>Department Details</Typography>
        <Typography><strong>ID:</strong> {dept.Id}</Typography>
        <Typography><strong>Name:</strong> {dept.Dept_name}</Typography>
        <Typography><strong>Address:</strong> {dept.address}</Typography>
        <Typography><strong>GPS Lat:</strong> {dept.Gps_lat}</Typography>
        <Typography><strong>GPS Long:</strong> {dept.Gps_long}</Typography>
        <Typography><strong>Manager:</strong> {dept.Dept_manager}</Typography>
        <Typography><strong>Phone #1:</strong> {dept.Dept_PhoneNumber1}</Typography>
        <Typography><strong>Phone #2:</strong> {dept.Dept_phoneNumber2}</Typography>
        <Typography><strong>Head Dept:</strong> {headDeptName}</Typography>
        <Typography><strong>Created At:</strong> {dept.crt_date}</Typography>
        <Typography><strong>Modified At:</strong> {dept.Modified_date}</Typography>
        <Typography>
          <strong>Is Active:</strong> {statusToText(dept.Is_Active)}
        </Typography>

        {dept.users && dept.users.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Department Users</Typography>
            <List>
              {dept.users.map((u) => (
                <ListItem key={u.Id}>
                  <ListItemText
                    primary={`${u.FName || ''} ${u.LName || ''}`}
                    secondary={
                      <>
                        {u.Email} | {u.Job_Title} | Role: {u.User_Role} <br />
                        Start: {u.Start_Date}, End: {u.End_Date || 'N/A'}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => onRemoveUser(u.Id, dept.Id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Box mt={2}>
          <Button variant="contained" onClick={() => onOpenDepartmentDialog(dept.comp_ID || '', dept)}>
            Edit Department
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={() => onOpenAssignDialog(dept.Id)}>
            Add User
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
};

export default SidebarDetails;
