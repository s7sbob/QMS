/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/apps/users/UserDetails.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { IconPencil, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { IUser, addEditUserApi, deleteUser } from 'src/services/userService';
import axiosServices from 'src/utils/axiosServices';

// Additional interfaces for extra data
interface Company {
  Id: string;
  Name: string;
}

interface DepartmentOption {
  Id: string;
  Dept_name: string;
}

interface Role {
  Id: string;
  Name: string;
}

type DepartmentAssignment = {
  departmentId: string;
  roleId: string;
};

// Extend the IUser interface with extra editable fields
type ExtendedUser = IUser & {
  companyId?: string;
  dateOfBirth?: string; // formatted as yyyy-MM-dd
  departmentAssignments?: DepartmentAssignment[];
  // Note: the following property may be provided from the API:
  Users_Departments_Users_Departments_User_IdToUser_Data?: any[];
};

type UserDetailsProps = {
  user: IUser | null;
};

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<ExtendedUser | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [departmentAssignments, setDepartmentAssignments] = useState<DepartmentAssignment[]>([]);

  // When a user is selected, prefill the editedUser state
  useEffect(() => {
    if (user) {
      const extUser: ExtendedUser = { ...user } as ExtendedUser;
      // Use the lower-case property from IUser
      if (user.dateOfBirth) {
        extUser.dateOfBirth = new Date(user.dateOfBirth).toISOString().split('T')[0];
      }
      // Assume the first company in Comp_Data array is the assigned company
      if (user.Comp_Data && Array.isArray(user.Comp_Data) && user.Comp_Data.length > 0) {
        extUser.companyId = user.Comp_Data[0].Id;
      }
      // Pre-fill department assignments using optional chaining
      if (
        user['Users_Departments_Users_Departments_User_IdToUser_Data'] &&
        (user['Users_Departments_Users_Departments_User_IdToUser_Data'] as any[]).length > 0
      ) {
        const assignments = (
          user['Users_Departments_Users_Departments_User_IdToUser_Data'] as any[]
        ).map((assignment) => ({
          departmentId: assignment.Department_Data.Id,
          roleId: assignment.User_Roles ? assignment.User_Roles.Id : '',
        }));
        setDepartmentAssignments(assignments);
        extUser.departmentAssignments = assignments;
      } else {
        setDepartmentAssignments([]);
      }
      setEditedUser(extUser);
      setEditMode(false);
    } else {
      setEditedUser(null);
      setDepartmentAssignments([]);
    }
  }, [user]);

  // Load companies and roles on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data } = await axiosServices.get('/api/companies/getAllCompanies');
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    const loadRoles = async () => {
      try {
        const { data } = await axiosServices.get('/api/userroles/getAll');
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    loadCompanies();
    loadRoles();
  }, []);

  // When the company changes, load the corresponding departments
  useEffect(() => {
    const loadDepartments = async () => {
      if (editedUser && editedUser.companyId) {
        try {
          const { data } = await axiosServices.get(
            `/api/department/compdepartments/${editedUser.companyId}`,
          );
          setDepartments(data);
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      } else {
        setDepartments([]);
      }
    };
    loadDepartments();
  }, [editedUser?.companyId]);

  const handleEditToggle = async () => {
    if (editMode && editedUser) {
      try {
        const formData = new FormData();
        formData.append('Id', editedUser.Id);
        formData.append('FName', editedUser.FName);
        formData.append('LName', editedUser.LName);
        formData.append('Email', editedUser.Email);
        formData.append('UserName', editedUser.UserName);
        formData.append('Password', editedUser.Password || '');
        formData.append('dateOfBirth', editedUser.dateOfBirth || '');
        formData.append('companyId', editedUser.companyId || '');
        formData.append('signUrl', editedUser.signUrl || '');
        formData.append('departmentAssignments', JSON.stringify(departmentAssignments));
        await addEditUserApi(formData);
        console.log('User updated successfully!');
      } catch (err) {
        console.error('Error updating user:', err);
        alert('Failed to update user');
      }
    }
    setEditMode(!editMode);
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.Id);
      alert('User soft-deleted successfully!');
      // Optionally refresh user list or clear selected user
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value, type, checked } = e.target;
    if (name === 'is_Active' && type === 'checkbox') {
      setEditedUser({
        ...editedUser,
        is_Active: checked ? 1 : 0,
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value,
      });
    }
  };

  // Handle file change for signature image
  const handleSignUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setEditedUser({
        ...editedUser,
        signUrl: previewUrl,
      });
    }
  };

  // Handle company dropdown change
  const handleCompanyChange = (e: SelectChangeEvent<string>) => {
    if (!editedUser) return;
    const companyId = e.target.value;
    setEditedUser({
      ...editedUser,
      companyId,
    });
    // Reset department assignments when company changes
    setDepartmentAssignments([]);
  };

  // Handle changes in department assignments (for department or role)
  const handleDepartmentAssignmentChange = (
    index: number,
    field: 'departmentId' | 'roleId',
    value: string,
  ) => {
    const newAssignments = [...departmentAssignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setDepartmentAssignments(newAssignments);
  };

  const addDepartmentAssignment = () => {
    setDepartmentAssignments([...departmentAssignments, { departmentId: '', roleId: '' }]);
  };

  const removeDepartmentAssignment = (index: number) => {
    const newAssignments = departmentAssignments.filter((_, i) => i !== index);
    setDepartmentAssignments(newAssignments);
  };

  if (!user || !editedUser) {
    return (
      <Box p={3} height="50vh" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4">Please Select a User</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box p={3} py={2} display="flex" alignItems="center">
        <Typography variant="h5">User Details</Typography>
        <Stack direction="row" gap={1} ml="auto">
          <Tooltip title={editMode ? 'Save' : 'Edit'}>
            <IconButton onClick={handleEditToggle}>
              {editMode ? (
                <IconDeviceFloppy size="18" stroke={1.3} />
              ) : (
                <IconPencil size="18" stroke={1.3} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <IconTrash size="18" stroke={1.3} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider />
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={editedUser.userImg_Url || ''}
            alt={`${editedUser.FName} ${editedUser.LName}`}
            sx={{ width: 72, height: 72 }}
          />
          <Box ml={2} flex={1}>
            <Stack direction="row" spacing={2}>
              {editMode ? (
                <>
                  <TextField
                    name="FName"
                    label="First Name"
                    variant="standard"
                    value={editedUser.FName}
                    onChange={handleChange}
                  />
                  <TextField
                    name="LName"
                    label="Last Name"
                    variant="standard"
                    value={editedUser.LName}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <Box>
                  <Typography variant="h6">
                    {editedUser.FName} {editedUser.LName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {editedUser.Email}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email:
            </Typography>
            {editMode ? (
              <TextField
                name="Email"
                variant="standard"
                value={editedUser.Email}
                onChange={handleChange}
                fullWidth
              />
            ) : (
              <Typography variant="body1">{editedUser.Email}</Typography>
            )}
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth:
            </Typography>
            {editMode ? (
              <TextField
                name="dateOfBirth"
                type="date"
                variant="standard"
                value={editedUser.dateOfBirth || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            ) : (
              <Typography variant="body1">
                {editedUser.dateOfBirth ? editedUser.dateOfBirth : 'N/A'}
              </Typography>
            )}
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Password:
            </Typography>
            {editMode ? (
              <TextField
                name="Password"
                variant="standard"
                type="password"
                value={editedUser.Password}
                onChange={handleChange}
                fullWidth
              />
            ) : (
              <Typography variant="body1">********</Typography>
            )}
          </Grid>

          {/* Active Status */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Active?
            </Typography>
            {editMode ? (
              <FormControlLabel
                control={
                  <Switch
                    name="is_Active"
                    checked={editedUser.is_Active === 1}
                    onChange={handleChange}
                  />
                }
                label={editedUser.is_Active === 1 ? 'Active' : 'Inactive'}
              />
            ) : (
              <Typography variant="body1">{editedUser.is_Active === 1 ? 'Yes' : 'No'}</Typography>
            )}
          </Grid>

          {/* Signature */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Signature:
            </Typography>
            {editMode ? (
              <Box display="flex" alignItems="center">
                {editedUser.signUrl && (
                  <Avatar
                    src={editedUser.signUrl}
                    alt="Signature Preview"
                    sx={{ width: 50, height: 50, mr: 1 }}
                    variant="rounded"
                  />
                )}
                <Button variant="outlined" component="label">
                  Upload Signature
                  <input type="file" hidden accept="image/*" onChange={handleSignUrlChange} />
                </Button>
              </Box>
            ) : (
              editedUser.signUrl && (
                <Avatar
                  src={editedUser.signUrl}
                  alt="Signature"
                  sx={{ width: 50, height: 50 }}
                  variant="rounded"
                />
              )
            )}
          </Grid>

          {/* Company Dropdown */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Company:
            </Typography>
            {editMode ? (
              <FormControl variant="standard" fullWidth>
                <InputLabel id="company-select-label">Select Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  value={editedUser.companyId || ''}
                  onChange={handleCompanyChange}
                  label="Select Company"
                >
                  {companies.map((comp) => (
                    <MenuItem key={comp.Id} value={comp.Id}>
                      {comp.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1">
                {editedUser.companyId
                  ? companies.find((comp) => comp.Id === editedUser.companyId)?.Name
                  : 'N/A'}
              </Typography>
            )}
          </Grid>

          {/* Department & Role Assignments */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Departments & Roles:
            </Typography>
            {editMode ? (
              <>
                {departmentAssignments.map((assignment, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <FormControl variant="standard" sx={{ mr: 2, flex: 1 }}>
                      <InputLabel id={`dept-select-label-${index}`}>Department</InputLabel>
                      <Select
                        labelId={`dept-select-label-${index}`}
                        value={assignment.departmentId}
                        onChange={(e: SelectChangeEvent<string>) =>
                          handleDepartmentAssignmentChange(index, 'departmentId', e.target.value)
                        }
                        label="Department"
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept.Id} value={dept.Id}>
                            {dept.Dept_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ mr: 2, flex: 1 }}>
                      <InputLabel id={`role-select-label-${index}`}>Role</InputLabel>
                      <Select
                        labelId={`role-select-label-${index}`}
                        value={assignment.roleId}
                        onChange={(e: SelectChangeEvent<string>) =>
                          handleDepartmentAssignmentChange(index, 'roleId', e.target.value)
                        }
                        label="Role"
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.Id} value={role.Id}>
                            {role.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeDepartmentAssignment(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button variant="contained" onClick={addDepartmentAssignment}>
                  Add Department
                </Button>
              </>
            ) : (
              <>
                {departmentAssignments.length > 0 ? (
                  departmentAssignments.map((assignment, index) => (
                    <Box key={index} mb={1}>
                      <Typography variant="body2">
                        Department:{' '}
                        {departments.find((dept) => dept.Id === assignment.departmentId)
                          ?.Dept_name || assignment.departmentId}
                      </Typography>
                      <Typography variant="body2">
                        Role:{' '}
                        {roles.find((role) => role.Id === assignment.roleId)?.Name ||
                          assignment.roleId}
                      </Typography>
                      <Divider />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">No department assignments</Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserDetails;
