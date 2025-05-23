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
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosServices from 'src/utils/axiosServices';
import { UserContext } from 'src/context/UserContext';

interface ChecklistItem {
  id: number;
  item: string;
  comply: string;
  comment: string;
}

const initialChecklist: ChecklistItem[] = [
  { id: 1, item: 'Document template and font format', comply: 'Yes', comment: '' },
  { id: 2, item: 'Does the document contain all items?', comply: 'Yes', comment: '' },
  {
    id: 3,
    item: 'Is the document title describing sufficiently the purpose?',
    comply: 'Yes',
    comment: '',
  },
  { id: 4, item: 'Is the document type right?', comply: 'Yes', comment: '' },
  { id: 5, item: 'Is the document code right? (CCP)', comply: 'Yes', comment: '' },
  { id: 6, item: 'Is the document version right? (CCP)', comply: 'Yes', comment: '' },
  { id: 7, item: 'Issue Date, Effective Date and Revision Date', comply: 'Yes', comment: '' },
  { id: 8, item: 'Is the effective period right?', comply: 'Yes', comment: '' },
  { id: 9, item: 'Page numbering (CCP)', comply: 'Yes', comment: '' },
  { id: 10, item: 'Updating of table of contents (CCP)', comply: 'Yes', comment: '' },
  { id: 11, item: 'Is the purpose appropriate for this document?', comply: 'Yes', comment: '' },
  {
    id: 12,
    item: 'Are all definitions and abbreviations clearly defined?',
    comply: 'Yes',
    comment: '',
  },
  { id: 13, item: 'Is the scope appropriate for this document?', comply: 'Yes', comment: '' },
  { id: 14, item: 'Are the responsibilities clearly determined?', comply: 'Yes', comment: '' },
  { id: 15, item: 'Are the safety concerns sufficient?', comply: 'Yes', comment: '' },
  {
    id: 16,
    item: 'Is the procedure clear and understandable for implementation?',
    comply: 'Yes',
    comment: '',
  },
  {
    id: 17,
    item: 'Are the procedure points written in a logical manner, using unambiguous language and easy to follow?',
    comply: 'Yes',
    comment: '',
  },
  {
    id: 18,
    item: 'Is the numbering system of titles, subtitles, and points (CCP)',
    comply: 'Yes',
    comment: '',
  },
  { id: 19, item: 'Are the critical control points sufficient?', comply: 'Yes', comment: '' },
  { id: 20, item: 'Are all attachments included in this document?', comply: 'Yes', comment: '' },
  { id: 21, item: 'Are all forms coded correctly? (CCP)', comply: 'Yes', comment: '' },
  {
    id: 22,
    item: 'Do all forms contain the required data and are they clear to use?',
    comply: 'Yes',
    comment: '',
  },
  { id: 23, item: 'Review of references', comply: 'Yes', comment: '' },
  {
    id: 24,
    item: 'Are all changes in the previous version mentioned in the change history?',
    comply: 'Yes',
    comment: '',
  },
];

type FormData = {
  department: string;
  documentId: string;
  documentName: string;
  documentVersion: string;
  revisionDate: string;
};

type Department = { Id: string; Dept_name: string };
type ISopHeader = { Id: string; Dept_Id: string; Doc_Code: string; Doc_Title_en: string };

type RevisionForm = {
  Id: string;
  Sop_HeaderId: string;
  revision_date: string;
  revision_requestedBy?: string;
  revision_ApprovedBy?: string;
  RevisionForm_Code: string;
  Question_Answer: Array<{
    QuestionId: string;
    Answer: number;
    Comment: string;
    User_Data: { userId: string; FName: string; LName: string; signUrl?: string };
  }>;
};

const DocumentRevisionChecklist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userRole =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';
  const userId = user?.Id;

  const revisionFormId = searchParams.get('revisionFormId');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [allSopHeaders, setAllSopHeaders] = useState<ISopHeader[]>([]);
  const [filteredSopHeaders, setFilteredSopHeaders] = useState<ISopHeader[]>([]);
  const [formData, setFormData] = useState<FormData>({
    department: '',
    documentId: '',
    documentName: '',
    documentVersion: '',
    revisionDate: '',
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [revisionForm, setRevisionForm] = useState<RevisionForm | null>(null);

  // load departments & headers
  useEffect(() => {
    const userDeps = user?.Users_Departments_Users_Departments_User_IdToUser_Data || [];
    setDepartments(
      userDeps.map((ud: any) => ({
        Id: ud.Department_Data.Id,
        Dept_name: ud.Department_Data.Dept_name,
      })),
    );
    axiosServices
      .get('/api/sopheader/getAllSopHeaders')
      .then((res) => setAllSopHeaders(res.data))
      .catch(console.error);
  }, []);

  // pre-select department & document
  useEffect(() => {
    const dept = searchParams.get('department');
    const docId = searchParams.get('documentId');
    if (dept) setFormData((f) => ({ ...f, department: dept }));
    if (docId) setFormData((f) => ({ ...f, documentId: docId }));
  }, [searchParams]);

  // filter headers
  useEffect(() => {
    if (formData.department) {
      setFilteredSopHeaders(allSopHeaders.filter((h) => h.Dept_Id === formData.department));
    }
  }, [formData.department, allSopHeaders]);

  // fetch revision form by id if provided
  useEffect(() => {
    if (!revisionFormId) return;
    axiosServices
      .get<RevisionForm>(`/api/Revisionform/getrevision-form/${revisionFormId}`)
      .then((res) => {
        const rf = res.data;
        setRevisionForm(rf);
        setFormData((f) => ({ ...f, documentVersion: rf.RevisionForm_Code }));
        setChecklist(
          initialChecklist.map((item) => {
            const ans = rf.Question_Answer.find((a) => a.QuestionId === String(item.id));
            return {
              ...item,
              comply: ans
                ? ans.Answer === 1
                  ? 'Yes'
                  : ans.Answer === 0
                  ? 'No'
                  : 'NA'
                : item.comply,
              comment: ans ? ans.Comment : '',
            };
          }),
        );
      })
      .catch(console.error);
  }, [revisionFormId]);

  // handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectDepartment = (e: SelectChangeEvent<string>) => {
    setFormData((f) => ({ ...f, department: e.target.value }));
  };
  const handleSelectSop = (e: SelectChangeEvent<string>) => {
    const id = e.target.value;
    const sel = filteredSopHeaders.find((s) => s.Id === id);
    if (sel) setFormData((f) => ({ ...f, documentId: sel.Id, documentName: sel.Doc_Title_en }));
  };
  const handleChecklistChange = (id: number, field: 'comply' | 'comment', value: string) =>
    setChecklist((prev) => prev.map((itm) => (itm.id === id ? { ...itm, [field]: value } : itm)));
  // const handlePrint = () => window.print();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { Sop_HeaderId: formData.documentId };
    if (!revisionForm) {
      // first-time submit
      payload.revision_date = new Date(formData.revisionDate);
      payload.RevisionForm_Code = formData.documentVersion;
      payload.answers = checklist.map((row) => ({
        questionNumber: String(row.id),
        comply: row.comply === 'Yes' ? 1 : row.comply === 'No' ? 0 : null,
        comment: row.comment,
      }));
      payload.revision_requestedBy = userId;
    } else if (userRole === 'QA Supervisor' && revisionForm && !revisionForm.revision_ApprovedBy) {
      // sup update
      payload.Id = revisionForm.Id;
      payload.answers = checklist.map((row) => ({
        questionNumber: String(row.id),
        comply: row.comply === 'Yes' ? 1 : row.comply === 'No' ? 0 : null,
        comment: row.comment,
      }));
      payload.revision_requestedBy = userId;
    } else if (userRole === 'QA Manager' && revisionForm && !revisionForm.revision_ApprovedBy) {
      // manager approve
      payload.Id = revisionForm.Id;
      payload.revision_ApprovedBy = userId;
    }
    try {
      const res = await axiosServices.post('/api/Revisionform/addEditrevision-form', payload);
      const returned: RevisionForm = res.data;
      // navigate with revisionFormId
      navigate(
        `?department=${formData.department}&documentId=${formData.documentId}&revisionFormId=${returned.Id}`,
        { replace: true },
      );
      setRevisionForm(returned);
    } catch (err) {
      console.error(err);
      alert('فشل الأرسال');
    }
  };

  const hasSup = !!revisionForm?.revision_requestedBy;
  const hasMgr = !!revisionForm?.revision_ApprovedBy;

  return (
    <Container sx={{ py: 4 }}>
      {/* Title + Form Code */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h4">Document Revision Checklist</Typography>
        <Typography variant="subtitle1" mt={1}>
          Form Code: {revisionForm?.RevisionForm_Code || formData.documentVersion}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={handleSelectDepartment}
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
              <FormControl fullWidth>
                <InputLabel>Document Title</InputLabel>
                <Select
                  value={formData.documentId}
                  label="Document Title"
                  onChange={handleSelectSop}
                >
                  {filteredSopHeaders.map((s) => (
                    <MenuItem key={s.Id} value={s.Id}>
                      {s.Doc_Title_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Version"
                name="documentVersion"
                value={formData.documentVersion}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Revision Date"
                name="revisionDate"
                value={formData.revisionDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box mt={3} overflow="auto">
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
                          onChange={(e) => handleChecklistChange(row.id, 'comply', e.target.value)}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="NA">N/A</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Comment"
                        value={row.comment}
                        size="small"
                        onChange={(e) => handleChecklistChange(row.id, 'comment', e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Signatures */}
          <Box mt={4} display="flex" justifyContent="center" gap={4}>
            {hasSup && (
              <Box textAlign="center">
                <Typography variant="subtitle1">Revised By</Typography>
                {revisionForm?.revision_requestedBy && (
                  <img
                    src={
                      revisionForm.Question_Answer.find(
                        (a) => a.User_Data.userId === revisionForm.revision_requestedBy,
                      )?.User_Data.signUrl
                    }
                    alt="Supervisor sig"
                    style={{ height: 60 }}
                  />
                )}
              </Box>
            )}
            {hasMgr && (
              <Box textAlign="center">
                <Typography variant="subtitle1">Approved By QA Manager</Typography>
                {revisionForm?.revision_ApprovedBy && (
                  <img
                    src={
                      revisionForm.Question_Answer.find(
                        (a) => a.User_Data.userId === revisionForm.revision_ApprovedBy,
                      )?.User_Data.signUrl
                    }
                    alt="Manager sig"
                    style={{ height: 60 }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box mt={4} textAlign="center">
            {userRole === 'QA Supervisor' && !hasSup && (
              <Button variant="contained" type="submit">
                Submit
              </Button>
            )}
            {userRole === 'QA Supervisor' && hasSup && !hasMgr && (
              <Button variant="contained" type="submit">
                Update
              </Button>
            )}
            {userRole === 'QA Manager' && hasSup && !hasMgr && (
              <Button variant="contained" type="submit">
                Approve
              </Button>
            )}
            {hasSup && !hasMgr && userRole !== 'QA Manager' && (
              <Typography>Waiting for manager confirmation…</Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DocumentRevisionChecklist;
