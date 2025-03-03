// src/views/ITManagement/components/AddEditDepartmentDialog.tsx

import React, { FormEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Checkbox, FormControlLabel
} from '@mui/material';
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { IDepartment, ICompany, SelectedItemType } from '../types';
import axiosServices from 'src/utils/axiosServices';

interface Props {
  open: boolean;
  onClose: () => void;
  fetchCompanies: () => void;
  departmentData: Partial<IDepartment>;
  setDepartmentData: React.Dispatch<React.SetStateAction<Partial<IDepartment>>>;
  selectedItem: ICompany | IDepartment | null;
  selectedType: SelectedItemType;
  setSelectedItem: React.Dispatch<React.SetStateAction<ICompany | IDepartment | null>>;
  selectedCompanyId: string;
  parentDepartmentId: string | null;
  setParentDepartmentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AddEditDepartmentDialog: React.FC<Props> = ({
  open,
  onClose,
  fetchCompanies,
  departmentData,
  setDepartmentData,
  selectedItem,
  selectedType,
  setSelectedItem,
  selectedCompanyId,
  parentDepartmentId,
  setParentDepartmentId,
}) => {
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
      onClose();
      setParentDepartmentId(null);

      // لو كنا نعدل القسم الحالي المعروض
      if (selectedType === 'department' && selectedItem?.Id === departmentData.Id) {
        const res = await axiosServices.get(`/api/department/getdepartment/${departmentData.Id}`);
        setSelectedItem(res.data);
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{departmentData.Id ? 'Edit Department' : 'Add Department'}</DialogTitle>
      <form onSubmit={handleSaveDepartment}>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={departmentData.Dept_name || ''}
            onChange={(e) =>
              setDepartmentData({ ...departmentData, Dept_name: e.target.value })
            }
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
            onChange={(e) =>
              setDepartmentData({ ...departmentData, Dept_PhoneNumber1: e.target.value })
            }
          />
          <TextField
            label="Phone #2"
            fullWidth
            margin="normal"
            value={departmentData.Dept_phoneNumber2 || ''}
            onChange={(e) =>
              setDepartmentData({ ...departmentData, Dept_phoneNumber2: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={departmentData.email || ''}
            onChange={(e) => setDepartmentData({ ...departmentData, email: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Created At"
              inputFormat="YYYY-MM-DD"
              value={departmentData.crt_date ? dayjs(departmentData.crt_date) : null}
              onChange={(newValue) => {
                setDepartmentData((prev) => ({
                  ...prev,
                  crt_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <DesktopDatePicker
              label="Modified At"
              inputFormat="YYYY-MM-DD"
              value={departmentData.Modified_date ? dayjs(departmentData.Modified_date) : null}
              onChange={(newValue) => {
                setDepartmentData((prev) => ({
                  ...prev,
                  Modified_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>

          <TextField
            label="Created By"
            fullWidth
            margin="normal"
            value={departmentData.crt_by || ''}
            onChange={(e) => setDepartmentData({ ...departmentData, crt_by: e.target.value })}
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditDepartmentDialog;
