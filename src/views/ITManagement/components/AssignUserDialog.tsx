// src/views/ITManagement/components/AssignUserDialog.tsx

import React, { FormEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import {
  LocalizationProvider,
  DesktopDatePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { ICompany, IDepartment, IUserData, IUserRole, SelectedItemType } from '../types';
import axiosServices from 'src/utils/axiosServices';

interface Props {
  open: boolean;
  onClose: () => void;
  assignData: {
    userId?: string;
    departmentId?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    userRoleId?: string;
  };
  setAssignData: React.Dispatch<React.SetStateAction<{
    userId?: string;
    departmentId?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    userRoleId?: string;
  }>>;
  allUsers: IUserData[];
  allRoles: IUserRole[];
  fetchCompanies: () => void;
  selectedItem: ICompany | IDepartment | null;
  selectedType: SelectedItemType;
  setSelectedItem: React.Dispatch<React.SetStateAction<ICompany | IDepartment | null>>;
}

const AssignUserDialog: React.FC<Props> = ({
  open,
  onClose,
  assignData,
  setAssignData,
  allUsers,
  allRoles,
  fetchCompanies,
  selectedItem,
  selectedType,
  setSelectedItem,
}) => {
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
      onClose();

      // لو القسم الحالي هو ما تم الإضافة إليه => نعيد جلب بياناته
      if (selectedType === 'department' && selectedItem?.Id === assignData.departmentId) {
        const res = await axiosServices.get(`/api/department/getdepartment/${assignData.departmentId}`);
        setSelectedItem(res.data);
      }
    } catch (error) {
      console.error('Error assigning user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Select Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Select Role"
              required
              value={assignData.userRoleId || ''}
              onChange={(e) => setAssignData({ ...assignData, userRoleId: e.target.value })}
            >
              {allRoles.map((role) => (
                <MenuItem key={role.Id} value={role.Id}>
                  {role.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Job Title"
            fullWidth
            margin="normal"
            required
            value={assignData.jobTitle || ''}
            onChange={(e) => setAssignData({ ...assignData, jobTitle: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Start Date"
              inputFormat="YYYY-MM-DD"
              value={assignData.startDate ? dayjs(assignData.startDate) : null}
              onChange={(newValue) => {
                setAssignData((prev) => ({
                  ...prev,
                  startDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} required fullWidth margin="normal" />
              )}
            />

            <DesktopDatePicker
              label="End Date (optional)"
              inputFormat="YYYY-MM-DD"
              value={assignData.endDate ? dayjs(assignData.endDate) : null}
              onChange={(newValue) => {
                setAssignData((prev) => ({
                  ...prev,
                  endDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignUserDialog;
