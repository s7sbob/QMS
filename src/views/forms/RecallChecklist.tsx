/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
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
    title: 'Recall Checklist',
  },
];

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

const RecallChecklist: React.FC = () => {
  const [requestStatus, setRequestStatus] = useState<string>('');
  const [requestDate, setRequestDate] = useState<Date | null>(null);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, text: 'Received the Recall Request (SFDA or Supplier)', checked: false },
    { id: 2, text: 'Hold all available Quantities and move to recall area (24 hrs)', checked: false },
    { id: 3, text: 'Ask for SFDA Approval (in case of supplier request the Recall)', checked: false },
    { id: 4, text: 'Inform Supplier (in case of SFDA request the Recall) (24 hrs)', checked: false },
    { id: 5, text: 'Prepare List of Customers', checked: false },
    { id: 6, text: 'Send Letters to Customers ( after SFDA approval)', checked: false },
    { id: 7, text: 'Confirm Actual Received Quantities and keep in recall area', checked: false },
    { id: 8, text: 'Update SFDA and Company', checked: false },
    { id: 9, text: 'Received SFDA final decision', checked: false },
    { id: 10, text: 'Coordinate with destruction company for appointment to destruct recalled product.', checked: false },
    { id: 11, text: 'Send Letter for Destruction appointment to SFDA', checked: false },
    { id: 12, text: 'Send Letter for Destruction appointment to Supplier', checked: false },
    { id: 13, text: 'Contact Finance for Stock Reconciliation', checked: false },
    { id: 14, text: 'Send Quantity to destruction company', checked: false },
    { id: 15, text: 'Receive Certificate of Destruction', checked: false },
    { id: 16, text: 'Forward Certificate of Destruction to supplier', checked: false },
    { id: 17, text: 'Forward Certificate of Destruction to Finance', checked: false },
    { id: 18, text: 'Update Recall logbook', checked: false },
  ]);

  const handleCheckboxChange = (id: number) => {
    setChecklist((prevChecklist) =>
      prevChecklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const [preparedBySignDate, setPreparedBySignDate] = useState<Date | null>(null);
  const [qaManagerApprovalSignDate, setQaManagerApprovalSignDate] = useState<Date | null>(null);

  return (
    <PageContainer title="Recall Checklist" description="Recall Checklist Form">
      <Breadcrumb title="Recall Checklist" items={BCrumb} />
      <ParentCard title="Recall Checklist">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="requestStatus">Request Status</CustomFormLabel>
            <CustomTextField
              id="requestStatus"
              name="requestStatus"
              value={requestStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestStatus(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="requestDate">Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={requestDate}
                onChange={(newValue: Date | null) => setRequestDate(newValue)}
                renderInput={(params) => <CustomTextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Checklist Items</Typography>
            <Grid container spacing={1}>
              {checklist.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(item.id)}
                        name={`checkbox-${item.id}`}
                      />
                    }
                    label={`${item.id}. ${item.text}`}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" mt={3}>
              <CustomFormLabel htmlFor="preparedBy">Prepared by: QA Manager</CustomFormLabel>
              <CustomFormLabel htmlFor="qaManagerApproval">Approval:</CustomFormLabel>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <CustomFormLabel htmlFor="preparedBySignDate">Signature/Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={preparedBySignDate}
                  onChange={(newValue: Date | null) => setPreparedBySignDate(newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <CustomFormLabel htmlFor="qaManagerApprovalSignDate">Signature/Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={qaManagerApprovalSignDate}
                  onChange={(newValue: Date | null) => setQaManagerApprovalSignDate(newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" mt={2}>
              Code #: QA-SOP-FRM-006.004/02
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default RecallChecklist;
