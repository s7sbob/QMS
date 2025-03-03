import React from "react";
import { Box, Typography } from "@mui/material";

const SOPTitleSection: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        border: "1px solid #000",
        p: 1,
        my: 2,
      }}
    >
      <Typography variant="h6" sx={{ margin: 0, fontWeight: "bold" }}>
        Standard Operating Procedure
      </Typography>
      <Typography variant="h6" sx={{ margin: 0 }}>
        Documentation System
      </Typography>
      <Typography variant="h6" sx={{ margin: 0 }}>
        نظام التوثيق
      </Typography>

      {/* قسم الرعاية الصحية أسفل العناوين */}
      <Typography
        variant="h6"
        sx={{ marginTop: 2, fontWeight: "bold" }}
      >
        Healthcare Division
      </Typography>
    </Box>
  );
};

export default SOPTitleSection;
