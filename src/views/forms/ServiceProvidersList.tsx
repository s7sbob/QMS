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
    title: 'Service Providers List',
  },
];

interface ServiceProviderEntry {
  sn: number;
  serviceProviderName: string;
  serviceQualificationDate: Date | null;
  companyAddress: string;
  contactPersonsInformation: string;
  percentage: string;
}

const ServiceProvidersList: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<ServiceProviderEntry[]>([]);
  const [newEntry, setNewEntry] = useState<ServiceProviderEntry>({
    sn: 1,
    serviceProviderName: '',
    serviceQualificationDate: null,
    companyAddress: '',
    contactPersonsInformation: '',
    percentage: '',
  });

  const handleAddEntry = () => {
    setEntries([...entries, { ...newEntry, sn: entries.length + 1 }]);
    setNewEntry({
      sn: entries.length + 2,
      serviceProviderName: '',
      serviceQualificationDate: null,
      companyAddress: '',
      contactPersonsInformation: '',
      percentage: '',
    });
  };

  return (
    <PageContainer title="Service Providers List" description="Service Providers List Form">
      <Breadcrumb title="Service Providers List" items={BCrumb} />
      <ParentCard title="Service Providers List">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="location">Location</CustomFormLabel>
            <CustomTextField
              id="location"
              name="location"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="date">Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mb={2}>Service Provider Re Evaluation</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.N</TableCell>
                    <TableCell>Service provider Name</TableCell>
                    <TableCell>Service Qualification date</TableCell>
                    <TableCell>Company address</TableCell>
                    <TableCell>Contact persons information</TableCell>
                    <TableCell>percentage</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.sn}>
                      <TableCell>{entry.sn}</TableCell>
                      <TableCell>{entry.serviceProviderName}</TableCell>
                      <TableCell>{entry.serviceQualificationDate?.toLocaleDateString()}</TableCell>
                      <TableCell>{entry.companyAddress}</TableCell>
                      <TableCell>{entry.contactPersonsInformation}</TableCell>
                      <TableCell>{entry.percentage}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" size="small">
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>{newEntry.sn}</TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.serviceProviderName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, serviceProviderName: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={newEntry.serviceQualificationDate}
                          onChange={(newValue) =>
                            setNewEntry({ ...newEntry, serviceQualificationDate: newValue })
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
                      <CustomTextField
                        value={newEntry.companyAddress}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, companyAddress: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.contactPersonsInformation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, contactPersonsInformation: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        value={newEntry.percentage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEntry({ ...newEntry, percentage: e.target.value })
                        }
                        fullWidth
                      />
                    </TableCell>
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
              <CustomFormLabel htmlFor="preparedBy">Prepared by: QA Associate</CustomFormLabel>
              <CustomFormLabel htmlFor="approvedBy">Approved by: QA Manager</CustomFormLabel>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <CustomFormLabel htmlFor="signDatePrepared">Sign/ Date: ----------------------------------</CustomFormLabel>
              <CustomFormLabel htmlFor="signDateApproved">Sign/ Date: ----------------------------------</CustomFormLabel>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" mt={2}>
              Code#: QA- SOP-FRM-016.004/02
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ServiceProvidersList;


