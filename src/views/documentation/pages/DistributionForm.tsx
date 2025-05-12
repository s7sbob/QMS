// src/pages/DistributionForm.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { UserContext, IUser } from 'src/context/UserContext';

interface CopyDetail {
  copyNumber: string;
  departmentId: string;
  receivedBy: string;
  receivedSign: string;
}

interface FormData {
  documentType: string;
  documentCode: string;
  documentTitle: string;
  version?: string;
  issueDate: string;
  revisionDate: string;
  numberOfCopies: string;
  destruction: string;
  copies: CopyDetail[];
}

interface Department {
  Id: string;
  Dept_name: string;
}

interface DeptUser {
  Id: string;
  FName: string;
  LName: string;
}

interface SopHeader {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
}

const DistributionForm: React.FC = () => {
  const user = useContext<IUser | null>(UserContext);
  const compId = user?.compId;

  // fetched data
  const [headers, setHeaders] = useState<SopHeader[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  // per-copy users options
  const [copyUsers, setCopyUsers] = useState<DeptUser[][]>([[]]);

  const [formData, setFormData] = useState<FormData>({
    documentType: 'SOP',
    documentCode: '',
    documentTitle: '',
    version: '',
    issueDate: '',
    revisionDate: '',
    numberOfCopies: '',
    destruction: '',
    copies: [
      { copyNumber: '1', departmentId: '', receivedBy: '', receivedSign: '' },
    ],
  });

  // load SOP headers
  useEffect(() => {
    axiosServices
      .get<SopHeader[]>('/api/sopheader/getAllSopHeaders')
      .then(res => setHeaders(res.data || []))
      .catch(err => console.error('Error loading headers:', err));
  }, []);

  // load departments for this company
  useEffect(() => {
    if (!compId) return;
    axiosServices
      .get<Department[]>(`/api/department/compdepartments/${compId}`)
      .then(res => setDepartments(res.data || []))
      .catch(err => console.error('Error loading departments:', err));
  }, [compId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'documentCode') {
      const hdr = headers.find(h => h.Doc_Code === value);
      setFormData(prev => ({
        ...prev,
        documentCode: value,
        documentTitle: hdr ? hdr.Doc_Title_en : '',
        version: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCopyChange = (
    index: number,
    field: keyof Omit<CopyDetail, 'copyNumber'>,
    value: string
  ) => {
    const updated = [...formData.copies];
    (updated[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, copies: updated }));

    if (field === 'departmentId') {
      // reset receivedBy
      updated[index].receivedBy = '';
      setFormData(prev => ({ ...prev, copies: updated }));
      // fetch users for this department
      axiosServices
        .get<{ users: DeptUser[] }>(`/api/department/getdepartment/${value}`)
        .then(res => {
          const users = res.data.users || [];
          setCopyUsers(prev => {
            const arr = [...prev];
            arr[index] = users;
            return arr;
          });
        })
        .catch(err => console.error('Error loading dept users:', err));
    }
  };

  const addCopyDetail = () => {
    setFormData(prev => {
      const nextNumber = prev.copies.length + 1;
      return {
        ...prev,
        copies: [
          ...prev.copies,
          { copyNumber: nextNumber.toString(), departmentId: '', receivedBy: '', receivedSign: '' },
        ],
      };
    });
    setCopyUsers(prev => [...prev, []]);
  };

  const removeCopyDetail = (index: number) => {
    setFormData(prev => {
      const filtered = prev.copies.filter((_, i) => i !== index);
      return {
        ...prev,
        copies: filtered.map((c, i) => ({ ...c, copyNumber: (i + 1).toString() })),
      };
    });
    setCopyUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Distribution Form Data:', formData);
    alert('تم إرسال النموذج بنجاح (هذا مثال وهمي)!');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Distribution Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Document Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Document Type"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              >
                <MenuItem value="SOP">SOP</MenuItem>
              </TextField>
            </Grid>

            {/* Document Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Document Code"
                name="documentCode"
                value={formData.documentCode}
                onChange={handleChange}
              >
                {headers.map(h => (
                  <MenuItem key={h.Id} value={h.Doc_Code}>
                    {h.Doc_Code}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Document Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Title"
                name="documentTitle"
                value={formData.documentTitle}
                disabled
              />
            </Grid>

            {/* Version */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Version #"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="(auto-filled later)"
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Issue Date"
                name="issueDate"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Revision Date"
                name="revisionDate"
                InputLabelProps={{ shrink: true }}
                value={formData.revisionDate}
                onChange={handleChange}
              />
            </Grid>

            {/* Copies distribution header */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Department - Approved Copies Distribution
              </Typography>
            </Grid>

            {/* Initial Copies */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Initial No. of Copies"
                name="numberOfCopies"
                inputProps={{ min: 1 }}
                value={formData.numberOfCopies}
                onChange={handleChange}
              />
            </Grid>

            {/* Copy Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Copy Details:
              </Typography>
              {formData.copies.map((copy, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {/* Copy # */}
                  <TextField
                    label="Copy #"
                    value={copy.copyNumber}
                    disabled
                    sx={{ width: 100 }}
                  />

                  {/* Department dropdown */}
                  <TextField
                    select
                    label="Department"
                    value={copy.departmentId}
                    onChange={e => handleCopyChange(idx, 'departmentId', e.target.value)}
                    sx={{ minWidth: 200 }}
                  >
                    {departments.map(d => (
                      <MenuItem key={d.Id} value={d.Id}>
                        {d.Dept_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Received By dropdown */}
                  <TextField
                    select
                    label="Received By"
                    value={copy.receivedBy}
                    onChange={e => handleCopyChange(idx, 'receivedBy', e.target.value)}
                    sx={{ minWidth: 200 }}
                  >
                    {copyUsers[idx]?.map(u => (
                      <MenuItem key={u.Id} value={u.Id}>
                        {u.FName} {u.LName}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Sign/Date */}
                  <TextField
                    label="Sign/Date"
                    required
                    value={copy.receivedSign}
                    onChange={e => handleCopyChange(idx, 'receivedSign', e.target.value)}
                    sx={{ minWidth: 200 }}
                  />

                  {/* Delete icon except for first */}
                  {idx > 0 && (
                    <IconButton
                      color="error"
                      onClick={() => removeCopyDetail(idx)}
                    >
                      <IconTrash />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button variant="outlined" onClick={addCopyDetail}>
                Add Another Copy
              </Button>
            </Grid>

            {/* Destruction */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destruction When Obsoletes (QA Signature/Date)"
                name="destruction"
                value={formData.destruction}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default DistributionForm;