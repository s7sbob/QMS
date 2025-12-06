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
  CircularProgress,
} from '@mui/material';
import { IconTrash, IconPrinter } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { UserContext, IUser } from 'src/context/UserContext';

interface CopyDetail {
  id?: string; // Track existing record ID from database
  copyNumber: string;
  departmentId: string;
  receivedBy: string;
  receivedSign: string;
  receivedDate: string;
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
  formCode?: string;
}

interface Department {
  Id: string;
  Dept_name: string;
}

interface DeptUser {
  Id: string;
  FName: string;
  LName: string;
  signUrl?: string | null;
}

interface SopHeader {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
}

interface DistributionFormRecord {
  Id: string;
  Sop_headerId: string;
  Dept_Id: string;
  user_Id: string;
  copy_number: number;
  Number_OfCopies: number;
}

const normalizeApiArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
};

const extractUsersArray = (payload: unknown): DeptUser[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return normalizeApiArray<DeptUser>(payload);
  }

  if (typeof payload === 'object') {
    const maybeDept = payload as {
      Users_Departments?: Array<{
        User_Id?: string;
        User_Data_Users_Departments_User_IdToUser_Data?: {
          Id?: string;
          FName?: string;
          LName?: string;
          signUrl?: string | null;
        };
      }>;
    };

    if (Array.isArray(maybeDept.Users_Departments)) {
      return maybeDept.Users_Departments.map(ud => {
        const user = ud.User_Data_Users_Departments_User_IdToUser_Data;
        return {
          Id: user?.Id || ud.User_Id || '',
          FName: user?.FName || '',
          LName: user?.LName || '',
          signUrl: user?.signUrl ?? null,
        };
      });
    }

    const maybeUsersProp = payload as { users?: unknown };
    if (maybeUsersProp.users !== undefined) {
      return normalizeApiArray<DeptUser>(maybeUsersProp.users);
    }
  }

  return [];
};

const formatTodayDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${now.getFullYear()}`;
};

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
    formCode: '',
    copies: [
      {
        copyNumber: '1',
        departmentId: '',
        receivedBy: '',
        receivedSign: '',
        receivedDate: '',
      },
    ],
  });

  // Track original copies for detecting modifications
  const [originalCopies, setOriginalCopies] = useState<CopyDetail[]>([]);
  // Track selected SOP header ID for fetching distribution forms
  const [selectedSopHeaderId, setSelectedSopHeaderId] = useState<string>('');
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Copy Details section loading state
  const [isCopyDetailsLoading, setIsCopyDetailsLoading] = useState<boolean>(false);

  // load SOP headers
  useEffect(() => {
    axiosServices
      .get<SopHeader[]>('/api/sopheader/getAllSopHeaders')
      .then(res => setHeaders(normalizeApiArray<SopHeader>(res.data)))
      .catch(err => console.error('Error loading headers:', err));
  }, []);

  // load departments for this company
  useEffect(() => {
    if (!compId) return;
    axiosServices
      .get<Department[]>(`/api/department/compdepartments/${compId}`)
      .then(res => setDepartments(normalizeApiArray<Department>(res.data)))
      .catch(err => console.error('Error loading departments:', err));
  }, [compId]);

  // load existing distribution forms when SOP header is selected
  useEffect(() => {
    if (!selectedSopHeaderId) return;

    setIsLoading(true);
    setIsCopyDetailsLoading(true);
    axiosServices
      .get<DistributionFormRecord[]>(`/api/distributionForm/getdistribution-forms/sop/${selectedSopHeaderId}`)
      .then(async res => {
        const records = normalizeApiArray<DistributionFormRecord>(res.data);

        if (records.length > 0) {
          // Convert database records to CopyDetail format
          const copies: CopyDetail[] = records.map((record, index) => ({
            id: record.Id,
            copyNumber: (index + 1).toString(),
            departmentId: record.Dept_Id || '',
            receivedBy: record.user_Id || '',
            receivedSign: '',
            receivedDate: '',
          }));

          // Store original copies for comparison
          setOriginalCopies(JSON.parse(JSON.stringify(copies)));

          // Update form data with loaded copies
          setFormData(prev => ({
            ...prev,
            numberOfCopies: records[0]?.Number_OfCopies?.toString() || '',
            copies,
          }));

          // Initialize copyUsers array with empty arrays
          setCopyUsers(new Array(copies.length).fill([]));

          // Load users for each department - collect all promises
          const userFetchPromises = copies.map((copy, index) => {
            if (copy.departmentId) {
              return axiosServices
                .get(`/api/department/getdepartment/${copy.departmentId}`)
                .then(res => {
                  const users = extractUsersArray(res.data);
                  setCopyUsers(prev => {
                    const arr = [...prev];
                    arr[index] = users;
                    return arr;
                  });

                  // After loading users, set signature and date for the selected user
                  const selectedUser = users.find(u => u.Id === copy.receivedBy);
                  if (selectedUser?.signUrl) {
                    setFormData(prevForm => {
                      const updatedCopies = [...prevForm.copies];
                      updatedCopies[index] = {
                        ...updatedCopies[index],
                        receivedSign: selectedUser.signUrl || '',
                        receivedDate: formatTodayDate(),
                      };
                      return { ...prevForm, copies: updatedCopies };
                    });
                  }
                })
                .catch(err => console.error('Error loading dept users:', err));
            }
            return Promise.resolve();
          });

          // Wait for all user fetches to complete
          await Promise.all(userFetchPromises);
        }
      })
      .catch(err => {
        console.error('Error loading distribution forms:', err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsCopyDetailsLoading(false);
      });
  }, [selectedSopHeaderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'documentCode') {
      const hdr = headers.find(h => h.Doc_Code === value);
      // Auto-generate form code: DOC_CODE-FRM-001.002/03
      const generatedFormCode = value ? `${value}-FRM-001.002/03` : '';
      setFormData(prev => ({
        ...prev,
        documentCode: value,
        documentTitle: hdr ? hdr.Doc_Title_en : '',
        version: '',
        formCode: generatedFormCode,
      }));
      // Set selected SOP header ID to trigger loading distribution forms
      if (hdr) {
        setSelectedSopHeaderId(hdr.Id);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCopyChange = (
    index: number,
    field: keyof Omit<CopyDetail, 'copyNumber'>,
    value: string
  ) => {
    setFormData(prev => {
      const updated = prev.copies.map((copy, idx) => {
        if (idx !== index) return copy;
        const nextCopy: CopyDetail = {
          ...copy,
          [field]: value,
        } as CopyDetail;
        if (field === 'departmentId') {
          nextCopy.receivedBy = '';
          nextCopy.receivedSign = '';
          nextCopy.receivedDate = '';
        } else if (field === 'receivedBy') {
          const selectedUser = copyUsers[index]?.find(user => user.Id === value);
          if (selectedUser?.signUrl) {
            nextCopy.receivedSign = selectedUser.signUrl;
            nextCopy.receivedDate = formatTodayDate();
          } else {
            nextCopy.receivedSign = '';
            nextCopy.receivedDate = '';
          }
        } else if (field === 'receivedSign' && !value) {
          nextCopy.receivedDate = '';
        }
        return nextCopy;
      });
      return { ...prev, copies: updated };
    });

    if (field !== 'departmentId') {
      return;
    }

    if (!value) {
      setCopyUsers(prev => {
        const arr = [...prev];
        arr[index] = [];
        return arr;
      });
      return;
    }

    axiosServices
      .get(`/api/department/getdepartment/${value}`)
      .then(res => {
        const users = extractUsersArray(res.data);
        setCopyUsers(prev => {
          const arr = [...prev];
          arr[index] = users;
          return arr;
        });
      })
      .catch(err => console.error('Error loading dept users:', err));
  };

  const addCopyDetail = () => {
    setFormData(prev => {
      const nextNumber = prev.copies.length + 1;
        return {
          ...prev,
          copies: [
            ...prev.copies,
            {
              copyNumber: nextNumber.toString(),
              departmentId: '',
              receivedBy: '',
              receivedSign: '',
              receivedDate: '',
            },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSopHeaderId) {
      alert('Please select a document code first.');
      return;
    }

    setIsLoading(true);

    try {
      const promises: Promise<any>[] = [];
      let successCount = 0;
      let errorCount = 0;

      // Loop through all copies
      for (let i = 0; i < formData.copies.length; i++) {
        const copy = formData.copies[i];

        // Validate required fields
        if (!copy.departmentId || !copy.receivedBy) {
          console.warn(`Skipping copy ${copy.copyNumber}: missing department or user`);
          continue;
        }

        const payload = {
          Sop_headerId: selectedSopHeaderId,
          Dept_Id: copy.departmentId,
          user_Id: copy.receivedBy,
          copy_number: parseInt(copy.copyNumber),
          Number_OfCopies: parseInt(formData.numberOfCopies) || 1,
          frm_code: formData.formCode || null,
        };

        if (copy.id) {
          // Existing record - check if modified
          const original = originalCopies.find(oc => oc.id === copy.id);
          const isModified =
            !original ||
            original.departmentId !== copy.departmentId ||
            original.receivedBy !== copy.receivedBy;

          if (isModified) {
            // Update existing record
            promises.push(
              axiosServices
                .put(`/api/distributionForm/updatedistribution-forms/${copy.id}`, payload)
                .then(() => {
                  successCount++;
                  console.log(`Updated copy ${copy.copyNumber}`);
                })
                .catch(err => {
                  errorCount++;
                  console.error(`Error updating copy ${copy.copyNumber}:`, err);
                })
            );
          }
        } else {
          // New record - create it
          promises.push(
            axiosServices
              .post('/api/distributionForm/createdistribution-forms', payload)
              .then(() => {
                successCount++;
                console.log(`Created copy ${copy.copyNumber}`);
              })
              .catch(err => {
                errorCount++;
                console.error(`Error creating copy ${copy.copyNumber}:`, err);
              })
          );
        }
      }

      // Wait for all requests to complete
      await Promise.all(promises);

      if (errorCount === 0) {
        alert(`Successfully saved ${successCount} distribution record(s)!`);
        // Reload the distribution forms to refresh the data
        if (selectedSopHeaderId) {
          setSelectedSopHeaderId(''); // Clear first
          setTimeout(() => setSelectedSopHeaderId(selectedSopHeaderId), 100); // Then reload
        }
      } else {
        alert(
          `Completed with ${successCount} success(es) and ${errorCount} error(s). Check console for details.`
        );
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!selectedSopHeaderId) {
      alert('Please select a document code first.');
      return;
    }
    // Open print view in new window
    window.open(`/documentation-control/distribution-form-print?headerId=${selectedSopHeaderId}`, '_blank');
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
              {isCopyDetailsLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                    py: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
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
                      <Box
                        sx={{
                          minWidth: 200,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ alignSelf: 'flex-start' }}>
                          Sign/Date
                        </Typography>
                        {copy.receivedSign ? (
                          <Box
                            component="img"
                            src={copy.receivedSign}
                            alt="Signature"
                            sx={{ maxHeight: 60, objectFit: 'contain', width: '100%' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Signature not selected
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {copy.receivedDate || 'dd/mm/yyyy'}
                        </Typography>
                      </Box>

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
                </>
              )}
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

            {/* Submit and Print */}
            <Grid item xs={12}>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  startIcon={isLoading ? null : null}
                >
                  {isLoading ? 'Saving...' : 'Submit'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handlePrint}
                  startIcon={<IconPrinter />}
                  disabled={isLoading}
                >
                  Print
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
