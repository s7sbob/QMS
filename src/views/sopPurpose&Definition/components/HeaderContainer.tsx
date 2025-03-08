// src/components/HeaderContainer.tsx
import React from "react";
import HeaderLeft from "./HeaderLeft";
import HeaderCenter from "./HeaderCenter";
import HeaderRight from "./HeaderRight";
import { SopHeader } from "../types/SopHeader";

interface HeaderContainerProps {
  headerData?: SopHeader | null;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ headerData }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #000",
        padding: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HeaderLeft headerData={headerData} />
      <HeaderCenter headerData={headerData} />
      <HeaderRight headerData={headerData} />
    </div>
  );
};

export default HeaderContainer;
