// src/components/Scrollbar.tsx
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { Box, styled, SxProps } from "@mui/material";

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: "100%",
}));

interface PropsType {
  children: React.ReactNode;
  sx?: SxProps;
}

const Scrollbar: React.FC<PropsType> = ({ children, sx, ...other }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return <Box sx={{ overflowX: "auto" }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
