import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const SOPPreparedReviewApproved: React.FC = () => {
  const tableHeaderStyle = {
    border: "1px solid #000",
    padding: "8px",
    textAlign: "center" as const,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  };

  const tableCellStyle = {
    border: "1px solid #000",
    padding: "8px",
    textAlign: "center" as const,
  };

  return (
    <Table
      sx={{
        width: "100%",
        border: "1px solid #000",
        borderCollapse: "collapse",
        mb: 2,
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={tableHeaderStyle}>
            Prepared by
            <br />
            إعداد
          </TableCell>
          <TableCell sx={tableHeaderStyle}>
            Reviewed by
            <br />
            مراجعة
          </TableCell>
          <TableCell sx={tableHeaderStyle}>
            Approved by
            <br />
            اعتماد
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell sx={tableCellStyle}>
            <strong>QA Associate</strong>
            <br />
            Syed Mazhar
          </TableCell>
          <TableCell sx={tableCellStyle}>
            <strong>QA Supervisor</strong>
            <br />
            Wael Nafea
          </TableCell>
          <TableCell sx={tableCellStyle}>
            <strong>QA Manager</strong>
            <br />
            El Hassan Fathy
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default SOPPreparedReviewApproved;
