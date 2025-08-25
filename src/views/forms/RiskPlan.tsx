/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Risk Plan',
  },
];

interface RiskEntry {
  sr: number;
  site: string;
  department: string;
  processes: string;
  reassessmentDate: Date | null;
  actualDate: Date | null;
  followUpDate: Date | null;
  jan: boolean;
  feb: boolean;
  mar: boolean;
  apr: boolean;
  may: boolean;
  jun: boolean;
  jul: boolean;
  aug: boolean;
  sep: boolean;
  oct: boolean;
  nov: boolean;
  dec: boolean;
}

const RiskPlan: React.FC = () => {
  const [year, setYear] = useState<string>('');
  const [preparationDate, setPreparationDate] = useState<Date | null>(null);
  const [version, setVersion] = useState<string>('');
  const [entries, setEntries] = useState<RiskEntry[]>([]);
  const [newEntry, setNewEntry] = useState<RiskEntry>({
    sr: 1,
    site: '',
    department: '',
    processes: '',
    reassessmentDate: null,
    actualDate: null,
    followUpDate: null,
    jan: false,
    feb: false,
    mar: false,
    apr: false,
    may: false,
    jun: false,
    jul: false,
    aug: false,
    sep: false,
    oct: false,
    nov: false,
    dec: false,
  });

  const handleAddEntry = () => {
    setEntries([...entries, { ...newEntry, sr: entries.length + 1 }]);
    setNewEntry({
      sr: entries.length + 2,
      site: '',
      department: '',
      processes: '',
      reassessmentDate: null,
      actualDate: null,
      followUpDate: null,
      jan: false,
      feb: false,
      mar: false,
      apr: false,
      may: false,
      jun: false,
      jul: false,
      aug: false,
      sep: false,
      oct: false,
      nov: false,
      dec: false,
    });
  };

  const handleMonthChange = (month: keyof RiskEntry) => {
    setNewEntry((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const [preparedByName, setPreparedByName] = useState<string>('');
  const [preparedByPosition, setPreparedByPosition] = useState<string>('');
  const [preparedBySignDate, setPreparedBySignDate] = useState<Date | null>(null);

  const [approvedByName, setApprovedByName] = useState<string>('');
  const [approvedByPosition, setApprovedByPosition] = useState<string>('');
  const [approvedBySignDate, setApprovedBySignDate] = useState<Date | null>(null);

  return (
    <PageContainer title="Risk Plan" description="Risk Plan Form">
      <Breadcrumb title="Risk Plan" items={BCrumb} />
      <ParentCard title="Risk Plan">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="year">For year</CustomFormLabel>
            <CustomTextField
              id="year"
              name="year"
              value={year}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYear(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="preparationDate">Preparation date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                value={preparationDate}
                onChange={(newValue) => setPreparationDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="version">Version #</CustomFormLabel>
            <CustomTextField
              id="version"
              name="version"
              value={version}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVersion(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Expected time "month"</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="risk plan table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr.</TableCell>
                    <TableCell>Site</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Processes</TableCell>
                    <TableCell>Re-assessment date</TableCell>
                    <TableCell>Actual date</TableCell>
                    <TableCell>Follow up date</TableCell>
                    <TableCell>Jan</TableCell>
                    <TableCell>Feb</TableCell>
                    <TableCell>Mar</TableCell>
                    <TableCell>Apr</TableCell>
                    <TableCell>May</TableCell>
                    <TableCell>Jun</TableCell>
                    <TableCell>Jul</TableCell>
                    <TableCell>Aug</TableCell>
                    <TableCell>Sep</TableCell>
                    <TableCell>Oct</TableCell>
                    <TableCell>Nov</TableCell>
                    <TableCell>Dec</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.sr}>
                      <TableCell>{entry.sr}</TableCell>
                      <TableCell>{entry.site}</TableCell>
                      <TableCell>{entry.department}</TableCell>
                      <TableCell>{entry.processes}</TableCell>
                      <TableCell>{entry.reassessmentDate?.toLocaleDateString()}</TableCell>
                      <TableCell>{entry.actualDate?.toLocaleDateString()}</TableCell>
                      <TableCell>{entry.followUpDate?.toLocaleDateString()}</TableCell>
                      <TableCell><Checkbox checked={entry.jan} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.feb} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.mar} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.apr} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.may} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.jun} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.jul} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.aug} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.sep} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.oct} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.nov} disabled /></TableCell>
                      <TableCell><Checkbox checked={entry.dec} disabled /></TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" size="small">
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>{newEntry.sr}</TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.site}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, site: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.department}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, department: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.processes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, processes: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={newEntry.reassessmentDate}
                          onChange={(newValue) =>
                            setNewEntry({ ...newEntry, reassessmentDate: newValue })
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={newEntry.actualDate}
                          onChange={(newValue) =>
                            setNewEntry({ ...newEntry, actualDate: newValue })
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={newEntry.followUpDate}
                          onChange={(newValue) =>
                            setNewEntry({ ...newEntry, followUpDate: newValue })
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell><Checkbox checked={newEntry.jan} onChange={() => handleMonthChange('jan')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.feb} onChange={() => handleMonthChange('feb')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.mar} onChange={() => handleMonthChange('mar')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.apr} onChange={() => handleMonthChange('apr')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.may} onChange={() => handleMonthChange('may')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.jun} onChange={() => handleMonthChange('jun')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.jul} onChange={() => handleMonthChange('jul')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.aug} onChange={() => handleMonthChange('aug')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.sep} onChange={() => handleMonthChange('sep')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.oct} onChange={() => handleMonthChange('oct')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.nov} onChange={() => handleMonthChange('nov')} /></TableCell>
                    <TableCell><Checkbox checked={newEntry.dec} onChange={() => handleMonthChange('dec')} /></TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={handleAddEntry}>
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" mt={3}>
              <CustomFormLabel htmlFor="preparedByName">Prepared by:</CustomFormLabel>
              <CustomTextField
                id="preparedByName"
                name="preparedByName"
                value={preparedByName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreparedByName(e.target.value)}
                fullWidth
              />
              <CustomFormLabel htmlFor="approvedByName">Approved by:</CustomFormLabel>
              <CustomTextField
                id="approvedByName"
                name="approvedByName"
                value={approvedByName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApprovedByName(e.target.value)}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <CustomFormLabel htmlFor="preparedByPosition">Position:</CustomFormLabel>
              <CustomTextField
                id="preparedByPosition"
                name="preparedByPosition"
                value={preparedByPosition}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreparedByPosition(e.target.value)}
                fullWidth
              />
              <CustomFormLabel htmlFor="approvedByPosition">Position:</CustomFormLabel>
              <CustomTextField
                id="approvedByPosition"
                name="approvedByPosition"
                value={approvedByPosition}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApprovedByPosition(e.target.value)}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <CustomFormLabel htmlFor="preparedBySignDate">Sign/Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  format="dd/MM/yyyy"
                  value={preparedBySignDate}
                  onChange={(newValue) => setPreparedBySignDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <CustomFormLabel htmlFor="approvedBySignDate">Sign/Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  format="dd/MM/yyyy"
                  value={approvedBySignDate}
                  onChange={(newValue) => setApprovedBySignDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" mt={2}>
              Code #: QA-FRM-012.006/007
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default RiskPlan;


