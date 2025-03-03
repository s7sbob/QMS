import React from "react";
import { Typography } from "@mui/material";

const SOPFooter: React.FC = () => {
  return (
    <Typography
      variant="body2"
      sx={{ textAlign: "center", mt: 4, fontStyle: "italic" }}
    >
      Unauthorized duplication is prohibited
    </Typography>
  );
};

export default SOPFooter;
