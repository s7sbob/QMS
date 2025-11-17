/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Button,
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
    title: 'Risk Template',
  },
];

interface PersonSignature {
  name: string;
  title: string;
  signDate: Date | null;
}

interface RiskEvaluationEntry {
  sn: number;
  possibleFailureMode: string;
  possibleCauseOfFailure: string;
  processSteps: string;
  impactIfPresent: string;
  actualControl: string;
  freq: number | "";
  sev: number | "";
  det: number | "";
  rpn: number | "";
  priority: string;
}

interface ChangeHistoryEntry {
  no: number;
  issueNo: string;
  issueDate: Date | null;
  changedPages: string;
  changeBriefing: string;
}

const RiskTemplate: React.FC = () => {
  const [riskIdentification, setRiskIdentification] = useState<string>('');
  const [version, setVersion] = useState<string>('00');

  const [preparedBy, setPreparedBy] = useState<PersonSignature>({
    name: '',
    title: '',
    signDate: null,
  });
  const [reviewedBy, setReviewedBy] = useState<PersonSignature>({
    name: '',
    title: '',
    signDate: null,
  });
  const [approvedBy, setApprovedBy] = useState<PersonSignature>({
    name: '',
    title: '',
    signDate: null,
  });

  const [riskEvaluationEntries, setRiskEvaluationEntries] = useState<RiskEvaluationEntry[]>([
    { sn: 1, possibleFailureMode: '', possibleCauseOfFailure: '', processSteps: '', impactIfPresent: '', actualControl: '', freq: '', sev: '', det: '', rpn: '', priority: '' },
  ]);

  const [changeHistoryEntries, setChangeHistoryEntries] = useState<ChangeHistoryEntry[]>([
    { no: 1, issueNo: '', issueDate: null, changedPages: '', changeBriefing: '' },
  ]);

  const handleRiskEvaluationChange = (index: number, field: keyof RiskEvaluationEntry, value: any) => {
    const updatedEntries = [...riskEvaluationEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };

    // Calculate RPN if Freq, Sev, Det are numbers
    const freq = typeof updatedEntries[index].freq === 'number' ? updatedEntries[index].freq : 0;
    const sev = typeof updatedEntries[index].sev === 'number' ? updatedEntries[index].sev : 0;
    const det = typeof updatedEntries[index].det === 'number' ? updatedEntries[index].det : 0;
    if (freq && sev && det) {
      updatedEntries[index].rpn = freq * sev * det;
    } else {
      updatedEntries[index].rpn = '';
    }

    setRiskEvaluationEntries(updatedEntries);
  };

  const addRiskEvaluationEntry = () => {
    setRiskEvaluationEntries([
      ...riskEvaluationEntries,
      { sn: riskEvaluationEntries.length + 1, possibleFailureMode: '', possibleCauseOfFailure: '', processSteps: '', impactIfPresent: '', actualControl: '', freq: '', sev: '', det: '', rpn: '', priority: '' },
    ]);
  };

  const handleRemoveRiskEvaluationEntry = (index: number) => {
    setRiskEvaluationEntries(riskEvaluationEntries.filter((_, i) => i !== index));
  };

  const handleAddChangeHistoryEntry = () => {
    setChangeHistoryEntries([
      ...changeHistoryEntries,
      { no: changeHistoryEntries.length + 1, issueNo: '', issueDate: null, changedPages: '', changeBriefing: '' },
    ]);
  };

  const handleRemoveChangeHistoryEntry = (index: number) => {
    setChangeHistoryEntries(changeHistoryEntries.filter((_, i) => i !== index));
  };

  const handlePersonSignatureChange = (person: string, field: keyof PersonSignature, value: any) => {
    if (person === 'preparedBy') {
      setPreparedBy((prev) => ({ ...prev, [field]: value }));
    } else if (person === 'reviewedBy') {
      setReviewedBy((prev) => ({ ...prev, [field]: value }));
    } else if (person === 'approvedBy') {
      setApprovedBy((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <PageContainer title="Risk Template" description="Risk Template Form">
      <Breadcrumb title="Risk Template" items={BCrumb} />
      <ParentCard title="Risk Template">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <CustomFormLabel htmlFor="riskIdentification">Risk identification</CustomFormLabel>
              <CustomTextField
                id="riskIdentification"
                name="riskIdentification"
                value={riskIdentification}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskIdentification(e.target.value)}
                fullWidth
                sx={{ maxWidth: '300px' }}
              />
              <CustomFormLabel htmlFor="version">Version #</CustomFormLabel>
              <CustomTextField
                id="version"
                name="version"
                value={version}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVersion(e.target.value)}
                sx={{ maxWidth: '100px' }}
              />
            </Stack>
          </Grid>

          {/* Signatures */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Prepared by:</Typography>
                <CustomFormLabel htmlFor="preparedByName">Name</CustomFormLabel>
                <CustomTextField
                  id="preparedByName"
                  name="preparedByName"
                  value={preparedBy.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('preparedBy', 'name', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="preparedByTitle">Title</CustomFormLabel>
                <CustomTextField
                  id="preparedByTitle"
                  name="preparedByTitle"
                  value={preparedBy.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('preparedBy', 'title', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="preparedBySignDate">Sig. / Date</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={preparedBy.signDate}
                    onChange={(newValue: Date | null) => handlePersonSignatureChange('preparedBy', 'signDate', newValue)}
                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Reviewed by:</Typography>
                <CustomFormLabel htmlFor="reviewedByName">Name</CustomFormLabel>
                <CustomTextField
                  id="reviewedByName"
                  name="reviewedByName"
                  value={reviewedBy.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('reviewedBy', 'name', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="reviewedByTitle">Title</CustomFormLabel>
                <CustomTextField
                  id="reviewedByTitle"
                  name="reviewedByTitle"
                  value={reviewedBy.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('reviewedBy', 'title', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="reviewedBySignDate">Sig. / Date</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={reviewedBy.signDate}
                    onChange={(newValue: Date | null) => handlePersonSignatureChange('reviewedBy', 'signDate', newValue)}
                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Approved by:</Typography>
                <CustomFormLabel htmlFor="approvedByName">Name</CustomFormLabel>
                <CustomTextField
                  id="approvedByName"
                  name="approvedByName"
                  value={approvedBy.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('approvedBy', 'name', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="approvedByTitle">Title</CustomFormLabel>
                <CustomTextField
                  id="approvedByTitle"
                  name="approvedByTitle"
                  value={approvedBy.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePersonSignatureChange('approvedBy', 'title', e.target.value)}
                  fullWidth
                />
                <CustomFormLabel htmlFor="approvedBySignDate">Sig. / Date</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={approvedBy.signDate}
                    onChange={(newValue: Date | null) => handlePersonSignatureChange('approvedBy', 'signDate', newValue)}
                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>

          {/* Risk Assessment Procedure */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Risk Assessment Procedure:</Typography>
            <Typography variant="body1" mb={1}>
              Risk assessment by using the equation.
            </Typography>
            <Typography variant="body1" mb={2} sx={{ fontWeight: 'bold' }}>
              Risk priority number (RPN) = Severity X Frequency X Detection
            </Typography>
            <Typography variant="body1" mb={2}>
              The aspects severity, frequency & detection are assigned values from 1 to 4 (specified as follow).
            </Typography>
            <Typography variant="h6" mb={1}>Risk assessment criteria:</Typography>
            <Typography variant="h6" mb={1}>I. Severity / Consequence.</Typography>
            <Typography variant="body1" mb={2}>
              - GMP Severity:
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Classification</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>1</TableCell><TableCell>Very low</TableCell><TableCell>No adverse effects on product/process quality can be derived. The failure consequences are insignificant.</TableCell></TableRow>
                  <TableRow><TableCell>2</TableCell><TableCell>low</TableCell><TableCell>An applicable product can be expected. The master batch record is fulfilled, although some deviations in the process exist.</TableCell></TableRow>
                  <TableRow><TableCell>3</TableCell><TableCell>Medium</TableCell><TableCell>The use of the product is limited (e.g. specification is borderline), slight deviations in the process exist or process is unstable.</TableCell></TableRow>
                  <TableRow><TableCell>4</TableCell><TableCell>High</TableCell><TableCell>The product has to be rejected; damage to patient health</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" mb={2}>
              ** If the case have an impact to the business, environment & our ministry of health we add (1) for each in the severity total rank.
            </Typography>

            <Typography variant="h6" mb={1}>II. Frequency / Probability of occurrence:</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Classification</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>1</TableCell><TableCell>Unlikely</TableCell><TableCell>About once a year</TableCell></TableRow>
                  <TableRow><TableCell>2</TableCell><TableCell>Occasional</TableCell><TableCell>Once per month</TableCell></TableRow>
                  <TableRow><TableCell>3</TableCell><TableCell>Repeated</TableCell><TableCell>Once in 10 orders or &lt; 5 per month</TableCell></TableRow>
                  <TableRow><TableCell>4</TableCell><TableCell>Frequent</TableCell><TableCell>Once per order or &lt; daily</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" mb={1}>III. Probability of Detection:</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>1</TableCell><TableCell>Unlikely to be overlooked</TableCell><TableCell>Failure immediately identified. 100 % detected</TableCell></TableRow>
                  <TableRow><TableCell>2</TableCell><TableCell>Occasional been overlooked</TableCell><TableCell>Failure detected by procedure in place. 75 % detected</TableCell></TableRow>
                  <TableRow><TableCell>3</TableCell><TableCell>Repeated overlooked</TableCell><TableCell>Failure may be detected (e.g. audit as spot check, Monitoring). 50 % detected</TableCell></TableRow>
                  <TableRow><TableCell>4</TableCell><TableCell>Normally not detected</TableCell><TableCell>Failure very likely to be overlooked, hence not detected (e.g. no technical control, no manual or visual control). 0 % detected</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Risk Evaluation Table */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Risk Evaluation</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="risk evaluation table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.N</TableCell>
                    <TableCell>Possible failure mode</TableCell>
                    <TableCell>Possible cause of failure</TableCell>
                    <TableCell>Process steps</TableCell>
                    <TableCell>Impact if present</TableCell>
                    <TableCell>Actual control</TableCell>
                    <TableCell>Freq.</TableCell>
                    <TableCell>Sev.</TableCell>
                    <TableCell>D.</TableCell>
                    <TableCell>RPN</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskEvaluationEntries.map((entry, index) => (
                    <TableRow key={entry.sn}>
                      <TableCell>{entry.sn}</TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.possibleFailureMode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'possibleFailureMode', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.possibleCauseOfFailure}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'possibleCauseOfFailure', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.processSteps}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'processSteps', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.impactIfPresent}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'impactIfPresent', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.actualControl}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'actualControl', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={entry.freq}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'freq', parseInt(e.target.value) || '')}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={entry.sev}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'sev', parseInt(e.target.value) || '')}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={entry.det}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'det', parseInt(e.target.value) || '')}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>{entry.rpn}</TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.priority}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskEvaluationChange(index, 'priority', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveRiskEvaluationEntry(index)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={12} align="right">
                      <Button variant="contained" onClick={addRiskEvaluationEntry}>
                        Add Row
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Change History */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={2}>Change History</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="change history table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Issue #</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Changed pages</TableCell>
                    <TableCell>Change briefing</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changeHistoryEntries.map((entry, index) => (
                    <TableRow key={entry.no}>
                      <TableCell>{entry.no}</TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.issueNo}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedEntries = [...changeHistoryEntries];
                            updatedEntries[index].issueNo = e.target.value;
                            setChangeHistoryEntries(updatedEntries);
                          }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={entry.issueDate}
                            onChange={(newValue: Date | null) => {
                              const updatedEntries = [...changeHistoryEntries];
                              updatedEntries[index].issueDate = newValue;
                              setChangeHistoryEntries(updatedEntries);
                            }}
                            renderInput={(params) => <CustomTextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.changedPages}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedEntries = [...changeHistoryEntries];
                            updatedEntries[index].changedPages = e.target.value;
                            setChangeHistoryEntries(updatedEntries);
                          }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          value={entry.changeBriefing}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedEntries = [...changeHistoryEntries];
                            updatedEntries[index].changeBriefing = e.target.value;
                            setChangeHistoryEntries(updatedEntries);
                          }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveChangeHistoryEntry(index)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} align="right">
                      <Button variant="contained" onClick={handleAddChangeHistoryEntry}>
                        Add Row
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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

export default RiskTemplate;
