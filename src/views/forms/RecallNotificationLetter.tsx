/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
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
    title: 'Recall Notification Letter',
  },
];

const RecallNotificationLetter: React.FC = () => {
  const [letterNo, setLetterNo] = useState<string>('');
  const [recallDate, setRecallDate] = useState<Date | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [accountedBy, setAccountedBy] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [availableQuantity, setAvailableQuantity] = useState<string>('');
  const [pharmacist, setPharmacist] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [preparedSignDate, setPreparedSignDate] = useState<Date | null>(null);
  const [approvedSignDate, setApprovedSignDate] = useState<Date | null>(null);

  return (
    <PageContainer title="Recall Notification Letter" description="Recall Notification Letter Form">
      <Breadcrumb title="Recall Notification Letter" items={BCrumb} />
      <ParentCard title="Recall Notification Letter">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="letterNo">Letter #</CustomFormLabel>
            <CustomTextField
              id="letterNo"
              name="letterNo"
              value={letterNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLetterNo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="recallDate">Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={recallDate}
                onChange={(newValue: Date | null) => setRecallDate(newValue)}
                renderInput={(params) => <CustomTextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Product Details</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="productName">Product name</CustomFormLabel>
            <CustomTextField
              id="productName"
              name="productName"
              value={productName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="manufacturer">Manufacturer</CustomFormLabel>
            <CustomTextField
              id="manufacturer"
              name="manufacturer"
              value={manufacturer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturer(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="batchNo">Batch #</CustomFormLabel>
            <CustomTextField
              id="batchNo"
              name="batchNo"
              value={batchNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchNo(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Customer Details</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="customerName">Customer</CustomFormLabel>
            <CustomTextField
              id="customerName"
              name="customerName"
              value={customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
            <CustomTextField
              id="address"
              name="address"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="accountedBy">Accounted By</CustomFormLabel>
            <CustomTextField
              id="accountedBy"
              name="accountedBy"
              value={accountedBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountedBy(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
            <CustomTextField
              id="phone"
              name="phone"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="mobile">Mobile</CustomFormLabel>
            <CustomTextField
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="availableQuantity">Available quantity</CustomFormLabel>
            <CustomTextField
              id="availableQuantity"
              name="availableQuantity"
              value={availableQuantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailableQuantity(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>QA Department – Cigalah Warehouses</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="pharmacist">Pharmacist</CustomFormLabel>
            <CustomTextField
              id="pharmacist"
              name="pharmacist"
              value={pharmacist}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPharmacist(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="email">E-mail</CustomFormLabel>
            <CustomTextField
              id="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" mt={3}>
              <CustomFormLabel htmlFor="preparedBy">Prepared by: QA Associate</CustomFormLabel>
              <CustomFormLabel htmlFor="approvedBy">Approved by: QA Manager</CustomFormLabel>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <CustomFormLabel htmlFor="signDatePrepared">Sign/ Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={preparedSignDate}
                  onChange={(newValue: Date | null) => setPreparedSignDate(newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <CustomFormLabel htmlFor="signDateApproved">Sign/ Date:</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={approvedSignDate}
                  onChange={(newValue: Date | null) => setApprovedSignDate(newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" mt={2}>
              Code #: QA-SOP-FRM-006.002/02
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default RecallNotificationLetter;
