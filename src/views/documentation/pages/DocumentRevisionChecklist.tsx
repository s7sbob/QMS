// src/pages/DocumentRevisionChecklist.tsx
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
  revisedBy: string;
  approvedBy: string;
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
  const [formData, setFormData] = useState<FormData>({
    documentId: '',
    documentName: '',
    documentVersion: '',
    revisionDate: '',
    department: '',
    revisedBy: '',
    approvedBy: '',
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  // لتخزين بيانات الأقسام والـ SOPs
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allSopHeaders, setAllSopHeaders] = useState<ISopHeader[]>([]);
  const [filteredSopHeaders, setFilteredSopHeaders] = useState<ISopHeader[]>([]);

  const user = useContext(UserContext);

  // استيراد الأقسام من الـ UserContext (إذا كانت موجودة)
  useEffect(() => {
    if (user?.Users_Departments_Users_Departments_User_IdToUser_Data) {
      const userDepartments: Department[] = user.Users_Departments_Users_Departments_User_IdToUser_Data.map(
        (ud: any) => ({
          Id: ud.Department_Data?.Id,
          Dept_name: ud.Department_Data?.Dept_name,
        })
      );
      setDepartments(userDepartments);
    }
  }, [user]);

  // جلب جميع الـ SOP headers
  useEffect(() => {
    axiosServices
      .get('/api/sopheader/getAllSopHeaders')
      .then((res) => {
        setAllSopHeaders(res.data);
      })
      .catch((error) => console.error("Error fetching SOP headers:", error));
  }, []);

  // تحديث بيانات الحقول العامة
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // تحديث بيانات الـ Checklist
  const handleChecklistChange = (id: number, field: 'comply' | 'comment', value: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // عند اختيار القسم
  const handleSelectDepartment = (e: SelectChangeEvent<string>) => {
    const selectedDeptId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: selectedDeptId,
      documentId: '',
      documentName: '',
      documentVersion: '',
    }));
    const filtered = allSopHeaders.filter((sop) => sop.Dept_Id === selectedDeptId);
    setFilteredSopHeaders(filtered);
  };

  // عند اختيار الـ SOP (Document Title)
  const handleSelectSop = (e: SelectChangeEvent<string>) => {
    const selectedSopId = e.target.value;
    const selectedSop = filteredSopHeaders.find((sop) => sop.Id === selectedSopId);
    setFormData((prev) => ({
      ...prev,
      documentId: selectedSopId,
      documentName: selectedSop ? selectedSop.Doc_Title_en : '',
      documentVersion: selectedSop ? selectedSop.Doc_Code : '',
    }));
  };

  // عند الإرسال، يتم إرسال بيانات Revision Form إلى الـ API الخاص بها
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // استخدام معرف المستخدم من الـ UserContext لحقل revision_requestedBy
      const payload = {
        Sop_HeaderId: formData.documentId,
        revision_date: new Date(formData.revisionDate),
        revision_requestedBy: user?.Id, // استخدام المعرف بدل الاسم
        revision_ApprovedBy: user?.Id, // أو ممكن يكون حقل منفصل حسب من المفروض يبقى المسؤول (وهنا مثال)
        RevisionForm_Code: formData.documentVersion,
      };
      const response = await axiosServices.post(
        '/api/Revisionform/addEditrevision-form',
        payload
      );
      console.log('Revision Form submitted:', response.data);
      alert('تم إرسال النموذج بنجاح (هذا مثال توضيحي)!');
    } catch (error) {
      console.error(error);
      alert('فشل الإرسال، راجع الـ Console لمعرفة التفاصيل.');
    }
  };
  
  

  return (
    <Container sx={{ py: 4 }}>
      <Box component="header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Document Revision Checklist
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form id="revisionChecklist" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* قسم اختيار Department */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="department-select"
                  value={formData.department}
                  label="Department"
                  onChange={handleSelectDepartment}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.Id} value={dept.Id}>
                      {dept.Dept_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* قسم اختيار Document Title */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="sop-label">Document Title</InputLabel>
                <Select
                  labelId="sop-label"
                  id="sop-select"
                  value={formData.documentId}
                  label="Document Title"
                  onChange={handleSelectSop}
                  disabled={!formData.department}
                >
                  {filteredSopHeaders.map((sop) => (
                    <MenuItem key={sop.Id} value={sop.Id}>
                      {sop.Doc_Title_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* عرض Document Version في حقل معطل */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Document Version"
                name="documentVersion"
                value={formData.documentVersion}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
            </Grid>
            {/* Revision Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Revision Date"
                name="revisionDate"
                value={formData.revisionDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* جدول الـ Checklist */}
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
                {checklist.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-label-${row.id}`}>Select</InputLabel>
                        <Select
                          labelId={`select-label-${row.id}`}
                          value={row.comply}
                          label="Select"
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
                        onChange={(e) => handleChecklistChange(row.id, 'comment', e.target.value)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Revised By and Approved By fields */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Revised By"
                name="revisedBy"
                value={formData.revisedBy}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Approved By QA Manager"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => window.print()}>
              Print
            </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DocumentRevisionChecklist;
