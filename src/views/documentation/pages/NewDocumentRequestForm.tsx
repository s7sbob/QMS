import { Box, Typography, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox } from "@mui/material";

export default function NewDocumentRequestForm() {
  return (
    <Box p={4}>
      <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
        New Document Request Form
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <Typography>Requested code:</Typography>
          <TextField fullWidth size="small" variant="standard" />
        </Grid>
        <Grid item xs={4}>
          <Typography>Department:</Typography>
          <TextField fullWidth size="small" variant="standard" />
        </Grid>
        <Grid item xs={4}>
          <Typography>Date:</Typography>
          <TextField fullWidth size="small" variant="standard" placeholder="/   /" />
        </Grid>
      </Grid>

      <Typography>Document Title:</Typography>
      <TextField fullWidth variant="standard" size="small" sx={{ mb: 2 }} />

      <Typography fontWeight="bold">Purpose:</Typography>
      <TextField fullWidth multiline rows={2} variant="standard" sx={{ mb: 2 }} />

      <Typography fontWeight="bold">Scope:</Typography>
      <TextField fullWidth multiline rows={2} variant="standard" sx={{ mb: 2 }} />

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', bgcolor: '#e0f7fa' }}>
                Requested By
              </TableCell>
              <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', bgcolor: '#e0f7fa' }}>
                Reviewed By
              </TableCell>
            </TableRow>
            {['Name', 'Designation', 'Signature', 'Date'].map((label, i) => (
              <TableRow key={i}>
                <TableCell colSpan={2}>
                  <TextField fullWidth size="small" variant="standard" label={label} />
                </TableCell>
                <TableCell colSpan={2}>
                  <TextField fullWidth size="small" variant="standard" label={label + (label === 'Designation' ? ' / Department Manager' : '')} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography fontWeight="bold">QA Manager:</Typography>
      <Typography>- Comment/Decision:</Typography>
      <TextField fullWidth multiline rows={2} variant="standard" sx={{ mb: 2 }} />

      <Typography>- Type of document:</Typography>
      <TextField fullWidth variant="standard" size="small" sx={{ mb: 1 }} />

      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Checkbox />
        <Typography>Merge with existing document code</Typography>
        <TextField variant="standard" size="small" />
        <Checkbox />
        <Typography>New</Typography>
      </Box>

      <Typography fontWeight="bold">QA Document Officer:</Typography>
      <Typography>- New Document Code:</Typography>
      <TextField fullWidth variant="standard" size="small" sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#e0f7fa' }}>
                QA Manager approval
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#e0f7fa' }}>
                QA Document Officer
              </TableCell>
            </TableRow>
            {['Name', 'Signature', 'Date'].map((label, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField fullWidth size="small" variant="standard" label={label} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth size="small" variant="standard" label={label} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
