import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Training Matrix',
  },
];

interface TrainingRecord {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  hireDate: Date | null;
  trainings: {
    [trainingId: string]: {
      required: boolean;
      completed: boolean;
      completionDate: Date | null;
      expiryDate: Date | null;
      score: string;
      trainer: string;
      certificate: string;
    };
  };
}

interface TrainingMatrixData {
  year: string;
  department: string;
  preparedBy: string;
  preparedDate: Date | null;
  approvedBy: string;
  approvalDate: Date | null;
  trainingPrograms: string[];
  employees: TrainingRecord[];
}

const TrainingMatrix: React.FC = () => {
  const [formData, setFormData] = useState<TrainingMatrixData>({
    year: new Date().getFullYear().toString(),
    department: '',
    preparedBy: '',
    preparedDate: null,
    approvedBy: '',
    approvalDate: null,
    trainingPrograms: [
      'GMP Training',
      'GDP Training',
      'Quality Management System',
      'Document Control',
      'CAPA Training',
      'Audit Training',
      'Safety Training',
      'Computer System Validation',
      'Data Integrity',
      'Risk Management'
    ],
    employees: [
      {
        id: '1',
        employeeName: '',
        position: '',
        department: '',
        hireDate: null,
        trainings: {}
      }
    ]
  });

  const handleInputChange = (field: keyof TrainingMatrixData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmployeeChange = (index: number, field: string, value: any) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index] = {
      ...updatedEmployees[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      employees: updatedEmployees
    }));
  };

  const handleTrainingChange = (employeeIndex: number, trainingId: string, field: string, value: any) => {
    const updatedEmployees = [...formData.employees];
    if (!updatedEmployees[employeeIndex].trainings[trainingId]) {
      updatedEmployees[employeeIndex].trainings[trainingId] = {
        required: false,
        completed: false,
        completionDate: null,
        expiryDate: null,
        score: '',
        trainer: '',
        certificate: ''
      };
    }
    updatedEmployees[employeeIndex].trainings[trainingId] = {
      ...updatedEmployees[employeeIndex].trainings[trainingId],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      employees: updatedEmployees
    }));
  };

  const addEmployee = () => {
    const newEmployee: TrainingRecord = {
      id: (formData.employees.length + 1).toString(),
      employeeName: '',
      position: '',
      department: '',
      hireDate: null,
      trainings: {}
    };
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, newEmployee]
    }));
  };

  const removeEmployee = (index: number) => {
    if (formData.employees.length > 1) {
      const updatedEmployees = formData.employees.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        employees: updatedEmployees
      }));
    }
  };

  const addTrainingProgram = () => {
    const newProgram = prompt('Enter new training program name:');
    if (newProgram && !formData.trainingPrograms.includes(newProgram)) {
      setFormData(prev => ({
        ...prev,
        trainingPrograms: [...prev.trainingPrograms, newProgram]
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Handle form submission logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer title="Training Matrix" description="Training Matrix for tracking employee training requirements and completion">
      <Breadcrumb title="Training Matrix" items={BCrumb} />
      
      <ParentCard title="Training Matrix">
        <Box component="form" noValidate>
          {/* Header Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="year">Year</CustomFormLabel>
              <CustomTextField
                id="year"
                variant="outlined"
                fullWidth
                value={formData.year}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('year', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="department">Department</CustomFormLabel>
              <CustomTextField
                id="department"
                variant="outlined"
                fullWidth
                value={formData.department}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('department', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="preparedBy">Prepared By</CustomFormLabel>
              <CustomTextField
                id="preparedBy"
                variant="outlined"
                fullWidth
                value={formData.preparedBy}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('preparedBy', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="preparedDate">Prepared Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.preparedDate}
                  onChange={(newValue) => handleInputChange('preparedDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="approvedBy">Approved By</CustomFormLabel>
              <CustomTextField
                id="approvedBy"
                variant="outlined"
                fullWidth
                value={formData.approvedBy}
                onChange={(e: { target: { value: any; }; }) => handleInputChange('approvedBy', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="approvalDate">Approval Date</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.approvalDate}
                  onChange={(newValue) => handleInputChange('approvalDate', newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Training Programs */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Training Programs
                </Typography>
                <Button variant="outlined" onClick={addTrainingProgram}>
                  Add Training Program
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {formData.trainingPrograms.map((program, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Typography variant="body2" sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                      {program}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Employee Training Matrix */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Employee Training Matrix
                </Typography>
                <Button variant="outlined" onClick={addEmployee}>
                  Add Employee
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Hire Date</TableCell>
                      {formData.trainingPrograms.map((program, index) => (
                        <TableCell key={index} sx={{ fontWeight: 'bold', minWidth: 150 }}>
                          {program}
                        </TableCell>
                      ))}
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.employees.map((employee, employeeIndex) => (
                      <TableRow key={employeeIndex}>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={employee.employeeName}
                            onChange={(e: { target: { value: any; }; }) => handleEmployeeChange(employeeIndex, 'employeeName', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={employee.position}
                            onChange={(e: { target: { value: any; }; }) => handleEmployeeChange(employeeIndex, 'position', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={employee.department}
                            onChange={(e: { target: { value: any; }; }) => handleEmployeeChange(employeeIndex, 'department', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={employee.hireDate}
                              onChange={(newValue) => handleEmployeeChange(employeeIndex, 'hireDate', newValue)}
                              renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        {formData.trainingPrograms.map((_program, programIndex) => {
                          const trainingId = `training_${programIndex}`;
                          const training = employee.trainings[trainingId] || {
                            required: false,
                            completed: false,
                            completionDate: null,
                            expiryDate: null,
                            score: '',
                            trainer: '',
                            certificate: ''
                          };
                          
                          return (
                            <TableCell key={programIndex}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Checkbox
                                    checked={training.required}
                                    onChange={(e) => handleTrainingChange(employeeIndex, trainingId, 'required', e.target.checked)}
                                    size="small"
                                  />
                                  <Typography variant="caption">Required</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Checkbox
                                    checked={training.completed}
                                    onChange={(e) => handleTrainingChange(employeeIndex, trainingId, 'completed', e.target.checked)}
                                    size="small"
                                  />
                                  <Typography variant="caption">Completed</Typography>
                                </Box>
                                {training.completed && (
                                  <>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        label="Completion Date"
                                        value={training.completionDate}
                                        onChange={(newValue) => handleTrainingChange(employeeIndex, trainingId, 'completionDate', newValue)}
                                        renderInput={(params) => <CustomTextField {...params} fullWidth size="small" />}
                                      />
                                    </LocalizationProvider>
                                    <CustomTextField
                                      label="Score"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      value={training.score}
                                      onChange={(e: { target: { value: any; }; }) => handleTrainingChange(employeeIndex, trainingId, 'score', e.target.value)}
                                    />
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => removeEmployee(employeeIndex)}
                            disabled={formData.employees.length === 1}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handlePrint}
            >
              Print
            </Button>
          </Stack>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default TrainingMatrix;

