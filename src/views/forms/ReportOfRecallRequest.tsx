/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
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
    title: 'Report of Recall Request',
  },
];

const ReportOfRecallRequest: React.FC = () => {
  const [requestBy, setRequestBy] = useState<string>('');
  const [requestDate, setRequestDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<string>('');
  const [recallClassification, setRecallClassification] = useState<string>('');
  const [sfdaApproval, setSfdaApproval] = useState<string>('');
  const [recallLevel, setRecallLevel] = useState<string>('');

  const [productName, setProductName] = useState<string>('');
  const [conc, setConc] = useState<string>('');
  const [pack, setPack] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const [availableQuantities, setAvailableQuantities] = useState<string>('');
  const [marketedQuantities, setMarketedQuantities] = useState<string>('');
  const [recalledQuantities, setRecalledQuantities] = useState<string>('');
  const [totalRecalledQuantities, setTotalRecalledQuantities] = useState<string>('');

  const [finalDecision, setFinalDecision] = useState<string>('');
  const [finalDecisionDate, setFinalDecisionDate] = useState<Date | null>(null);

  const [preparedBySignDate, setPreparedBySignDate] = useState<Date | null>(null);
  const [qaManagerApprovalSignDate, setQaManagerApprovalSignDate] = useState<Date | null>(null);

  return (
    <PageContainer title="Report of Recall Request" description="Report of Recall Request Form">
      <Breadcrumb title="Report of Recall Request" items={BCrumb} />
      <ParentCard title="Report of Recall Request">
        <Grid container spacing={3}>
          {/* 1- Recall Request */}
          <Grid item xs={12}>
            <Typography variant="h6" mb={2}>1- Recall Request</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="requestBy">Request by</CustomFormLabel>
            <CustomTextField
              id="requestBy"
              name="requestBy"
              value={requestBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestBy(e.target.value)}
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
            <CustomFormLabel htmlFor="reason">Reason</CustomFormLabel>
            <CustomTextField
              id="reason"
              name="reason"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="recallClassification">Recall Classification</CustomFormLabel>
            <CustomTextField
              id="recallClassification"
              name="recallClassification"
              value={recallClassification}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecallClassification(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="sfdaApproval">SFDA approval</CustomFormLabel>
            <CustomTextField
              id="sfdaApproval"
              name="sfdaApproval"
              value={sfdaApproval}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSfdaApproval(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="recallLevel">Recall Level</CustomFormLabel>
            <RadioGroup
              row
              name="recallLevel"
              value={recallLevel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecallLevel(e.target.value)}
            >
              <FormControlLabel value="Class 1" control={<Radio />} label="Class (1)" />
              <FormControlLabel value="Class 2" control={<Radio />} label="Class (2)" />
              <FormControlLabel value="Class 3" control={<Radio />} label="Class (3)" />
            </RadioGroup>
          </Grid>

          {/* 2- Product Information */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>2- Product Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="productName">Product Name</CustomFormLabel>
            <CustomTextField
              id="productName"
              name="productName"
              value={productName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="conc">Conc.</CustomFormLabel>
            <CustomTextField
              id="conc"
              name="conc"
              value={conc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConc(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="pack">Pack</CustomFormLabel>
            <CustomTextField
              id="pack"
              name="pack"
              value={pack}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPack(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="supplier">Supplier</CustomFormLabel>
            <CustomTextField
              id="supplier"
              name="supplier"
              value={supplier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupplier(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="batchNo">Batch No.</CustomFormLabel>
            <CustomTextField
              id="batchNo"
              name="batchNo"
              value={batchNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchNo(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="expiryDate">Expiry Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={expiryDate}
                onChange={(newValue: Date | null) => setExpiryDate(newValue)}
                renderInput={(params) => <CustomTextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* 3- Quantity Information */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>3- Quantity Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="availableQuantities">Available Quantities (in warehouses)</CustomFormLabel>
            <CustomTextField
              id="availableQuantities"
              name="availableQuantities"
              value={availableQuantities}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailableQuantities(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="marketedQuantities">Marketed Quantities (to customers)</CustomFormLabel>
            <CustomTextField
              id="marketedQuantities"
              name="marketedQuantities"
              value={marketedQuantities}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketedQuantities(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="recalledQuantities">Recalled Quantities (from customers)</CustomFormLabel>
            <CustomTextField
              id="recalledQuantities"
              name="recalledQuantities"
              value={recalledQuantities}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecalledQuantities(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="totalRecalledQuantities">Total Recalled Quantities</CustomFormLabel>
            <CustomTextField
              id="totalRecalledQuantities"
              name="totalRecalledQuantities"
              value={totalRecalledQuantities}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalRecalledQuantities(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* 4- Final SFDA Decision */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>4- Final SFDA Decision</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="finalDecision">Final Decision</CustomFormLabel>
            <CustomTextField
              id="finalDecision"
              name="finalDecision"
              value={finalDecision}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFinalDecision(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="finalDecisionDate">Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={finalDecisionDate}
                onChange={(newValue: Date | null) => setFinalDecisionDate(newValue)}
                renderInput={(params) => <CustomTextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" mt={3}>
              <CustomFormLabel htmlFor="preparedBy">Prepared by:</CustomFormLabel>
              <CustomTextField
                id="preparedBy"
                name="preparedBy"
                value="---------------------------" // Placeholder
                fullWidth
                disabled
              />
              <CustomFormLabel htmlFor="qaManagerApproval">QA Manager Approval:</CustomFormLabel>
              <CustomTextField
                id="qaManagerApproval"
                name="qaManagerApproval"
                value="---------------------------" // Placeholder
                fullWidth
                disabled
              />
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
              Code #: QA-SOP-FRM-006.003/03
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ReportOfRecallRequest;
