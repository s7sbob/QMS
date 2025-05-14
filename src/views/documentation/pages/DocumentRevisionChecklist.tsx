import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';
import { useSearchParams } from 'react-router-dom';

interface ChecklistItem {
  id: number;
  item: string;
  comply: string;
  comment: string;
}

const initialChecklist: ChecklistItem[] = [
  { id: 1, item: 'Document template and font format', comply: 'Yes', comment: '' },
  { id: 2, item: 'Does the document contain all items?', comply: 'Yes', comment: '' },
  { id: 3, item: 'Is the document title describing sufficiently the purpose?', comply: 'Yes', comment: '' },
  { id: 4, item: 'Is the document type right?', comply: 'Yes', comment: '' },
  { id: 5, item: 'Is the document code right? (CCP)', comply: 'Yes', comment: '' },
  { id: 6, item: 'Is the document version right? (CCP)', comply: 'Yes', comment: '' },
  { id: 7, item: 'Issue Date, Effective Date and Revision Date', comply: 'Yes', comment: '' },
  { id: 8, item: 'Is the effective period right?', comply: 'Yes', comment: '' },
  { id: 9, item: 'Page numbering (CCP)', comply: 'Yes', comment: '' },
  { id: 10, item: 'Updating of table of contents (CCP)', comply: 'Yes', comment: '' },
  { id: 11, item: 'Is the purpose appropriate for this document?', comply: 'Yes', comment: '' },
  { id: 12, item: 'Are all definitions and abbreviations clearly defined?', comply: 'Yes', comment: '' },
  { id: 13, item: 'Is the scope appropriate for this document?', comply: 'Yes', comment: '' },
  { id: 14, item: 'Are the responsibilities clearly determined?', comply: 'Yes', comment: '' },
  { id: 15, item: 'Are the safety concerns sufficient?', comply: 'Yes', comment: '' },
  { id: 16, item: 'Is the procedure clear and understandable for implementation?', comply: 'Yes', comment: '' },
  { id: 17, item: 'Are the procedure points written in a logical manner, using unambiguous language and easy to follow?', comply: 'Yes', comment: '' },
  { id: 18, item: 'Is the numbering system of titles, subtitles, and points (CCP)', comply: 'Yes', comment: '' },
  { id: 19, item: 'Are the critical control points sufficient?', comply: 'Yes', comment: '' },
  { id: 20, item: 'Are all attachments included in this document?', comply: 'Yes', comment: '' },
  { id: 21, item: 'Are all forms coded correctly? (CCP)', comply: 'Yes', comment: '' },
  { id: 22, item: 'Do all forms contain the required data and are they clear to use?', comply: 'Yes', comment: '' },
  { id: 23, item: 'Review of references', comply: 'Yes', comment: '' },
  { id: 24, item: 'Are all changes in the previous version mentioned in the change history?', comply: 'Yes', comment: '' },
];

interface FormData {
  documentId: string;
  documentName: string;
  documentVersion: string;
  revisionDate: string;
  department: string;
}

interface Department {
  Id: string;
  Dept_name: string;
}

interface ISopHeader {
  Id: string;
  Dept_Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
}

const DocumentRevisionChecklist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const user = useContext(UserContext);
  const userRole =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]
      ?.User_Roles?.Name || '';
  const userName = user ? `${user.FName} ${user.LName}` : '';
  const userSign = user?.signUrl || '';

  const [formData, setFormData] = useState<FormData>({
    documentId: '',
    documentName: '',
    documentVersion: '',
    revisionDate: '',
    department: '',
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allSopHeaders, setAllSopHeaders] = useState<ISopHeader[]>([]);
  const [filteredSopHeaders, setFilteredSopHeaders] = useState<ISopHeader[]>([]);
  const [revisionForm, setRevisionForm] = useState<any | null>(null);

  // load departments
  useEffect(() => {
    const userDeps = user?.Users_Departments_Users_Departments_User_IdToUser_Data || [];
    setDepartments(
      userDeps.map((ud: any) => ({
        Id: ud.Department_Data.Id,
        Dept_name: ud.Department_Data.Dept_name,
      }))
    );
  }, [user]);

  // fetch headers
  useEffect(() => {
    axiosServices
      .get('/api/sopheader/getAllSopHeaders')
      .then((res) => setAllSopHeaders(res.data))
      .catch((err) => console.error(err));
  }, []);

  // preselect via URL
  useEffect(() => {
    const deptQ = searchParams.get('department');
    const docQ = searchParams.get('documentId');
    if (deptQ) {
      setFormData((f) => ({ ...f, department: deptQ }));
      const filtered = allSopHeaders.filter((s) => s.Dept_Id === deptQ);
      setFilteredSopHeaders(filtered);
      if (docQ) {
        const sel = filtered.find((s) => s.Id === docQ);
        if (sel) {
          setFormData((f) => ({
            ...f,
            documentId: sel.Id,
            documentName: sel.Doc_Title_en,
            documentVersion: sel.Doc_Code,
          }));
        }
      }
    }
  }, [allSopHeaders, searchParams]);

  // fetch existing revision form by Sop_HeaderId
  useEffect(() => {
    if (!formData.documentId) return;
    axiosServices
      .get('/api/Revisionform/revision-forms')
      .then((res) => {
        const found = res.data.find((r: any) => r.Sop_HeaderId === formData.documentId);
        if (found) {
          setRevisionForm(found);
          // populate answers
          setChecklist(
            initialChecklist.map((item) => {
              const ans = found.Question_Answer.find(
                (a: any) => a.QuestionId === item.id.toString()
              );
              return {
                ...item,
                comply: ans ? (ans.Answer === 1 ? 'Yes' : ans.Answer === 0 ? 'No' : 'NA') : item.comply,
                comment: ans ? ans.Comment : '',
              };
            })
          );
        }
      })
      .catch((e) => console.error(e));
  }, [formData.documentId]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChecklistChange = (
    id: number,
    field: 'comply' | 'comment',
    value: string
  ) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSelectDepartment = (e: SelectChangeEvent<string>) => {
    const department = e.target.value;
    setFormData((f) => ({
      ...f,
      department,
      documentId: '',
      documentName: '',
      documentVersion: '',
    }));
    setFilteredSopHeaders(allSopHeaders.filter((s) => s.Dept_Id === department));
  };

  const handleSelectSop = (e: SelectChangeEvent<string>) => {
    const id = e.target.value;
    const sel = filteredSopHeaders.find((s) => s.Id === id);
    if (sel) {
      setFormData((f) => ({
        ...f,
        documentId: sel.Id,
        documentName: sel.Doc_Title_en,
        documentVersion: sel.Doc_Code,
      }));
    }
  };

  const handlePrint = () => window.print();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        Sop_HeaderId: formData.documentId,
      };
      if (!revisionForm) {
        // Supervisor initial submit
        payload.revision_date = new Date(formData.revisionDate);
        payload.RevisionForm_Code = formData.documentVersion;
        payload.answers = checklist.map((row) => ({
          questionNumber: row.id.toString(),
          comply: row.comply === 'Yes' ? 1 : row.comply === 'No' ? 0 : null,
          comment: row.comment,
        }));
        payload.revision_requestedBy = user?.Id;
      } else if (userRole === 'QA Manager' && revisionForm && !revisionForm.revision_ApprovedBy) {
        // Manager approval
        payload.Id = revisionForm.Id;
        payload.revision_ApprovedBy = user?.Id;
      }

      await axiosServices.post(
        '/api/Revisionform/addEditrevision-form',
        payload
      );
      // refresh state
      setRevisionForm(null);
      // re-fetch
      setFormData((f) => ({ ...f }));
    } catch (err) {
      console.error(err);
      alert('فشل الإرسال');
    }
  };

  const hasSup = !!revisionForm?.revision_requestedBy;
  const hasMgr = !!revisionForm?.revision_ApprovedBy;

  // final view if both done
  if (hasSup && hasMgr) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Revision Complete</Typography>
          <Box sx={{ mt: 2 }}>
            {/* supervisor */}
            <Typography>Revised By:</Typography>
            <Box display="flex" alignItems="center" gap={1} justifyContent="center">
              {/** assume supervisor data available in revisionForm.Question_Answer[0].User_Data **/}
            </Box>
            {/* manager */}
            <Typography sx={{ mt: 2 }}>Approved By QA Manager:</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4">Document Revision Checklist</Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={handleSelectDepartment}
                  disabled={hasSup}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.Id} value={d.Id}>
                      {d.Dept_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Document Title</InputLabel>
                <Select
                  value={formData.documentId}
                  label="Document Title"
                  onChange={handleSelectSop}
                  disabled={!formData.department || hasSup}
                >
                  {filteredSopHeaders.map((s) => (
                    <MenuItem key={s.Id} value={s.Id}>
                      {s.Doc_Title_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
              <>  
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Document Version"
                    name="documentVersion"
                    value={formData.documentVersion}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="Revision Date"
                    name="revisionDate"
                    value={formData.revisionDate}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>
              </>
          </Grid>

          {!hasSup && (
            <Box sx={{ mt: 3, overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Item To Be Checked</TableCell>
                    <TableCell>Comply</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checklist.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={row.comply}
                            onChange={(e) =>
                              handleChecklistChange(row.id, 'comply', e.target.value)
                            }
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="NA">N/A</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Comment"
                          value={row.comment}
                          onChange={(e) =>
                            handleChecklistChange(row.id, 'comment', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {hasSup && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Revised By</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {userSign && (
                    <img
                      src={userSign}
                      alt="Supervisor signature"
                      style={{ height: 60 }}
                    />
                  )}
                  <Box>
                    <Typography>{userName}</Typography>
                    <Typography variant="caption">{userRole}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {hasMgr && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Approved By QA Manager</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {userSign && (
                    <img
                      src={userSign}
                      alt="Manager signature"
                      style={{ height: 60 }}
                    />
                  )}
                  <Box>
                    <Typography>{userName}</Typography>
                    <Typography variant="caption">{userRole}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {!hasSup && userRole === 'QA Supervisor' && (
              <Button
                variant="contained"
                type="submit"
                disabled={!formData.documentId || !formData.revisionDate}
              >
                Submit
              </Button>
            )}
            {hasSup && !hasMgr && userRole !== 'QA Supervisor' && userRole === 'QA Manager' && (
              <Button variant="contained" type="submit">
                Approve
              </Button>
            )}
            {hasSup && !hasMgr && userRole !== 'QA Manager' && (
              <Typography>Waiting for manager confirmation...</Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DocumentRevisionChecklist;
