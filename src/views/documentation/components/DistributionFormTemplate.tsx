// src/views/documentation/components/DistributionFormTemplate.tsx
import React, { ReactNode } from 'react';
import DistributionFormHeader from './DistributionFormHeader';
import DistributionFormApprovalSection from './DistributionFormApprovalSection';
import DistributionFormFooter from './DistributionFormFooter';
import './distributionForm.css';

interface SopHeaderData {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
  Version?: string;
  Issued_Date?: string;
  Revision_Date?: string;
  Page_Number?: string;
  prepared_by_sign?: string;
  reviewed_by_sign?: string;
  approved_by_sign?: string;
  prepared_date?: string;
  reviewed_date?: string;
  approved_date?: string;
  User_Data_Sop_header_Prepared_ByToUser_Data?: {
    FName: string;
    LName: string;
  };
  User_Data_Sop_header_reviewed_byToUser_Data?: {
    FName: string;
    LName: string;
  };
  User_Data_Sop_header_Approved_byToUser_Data?: {
    FName: string;
    LName: string;
  };
}

interface DistributionFormTemplateProps {
  children: ReactNode;
  sopHeaderData?: SopHeaderData | null;
  formCode?: string;
}

const DistributionFormTemplate: React.FC<DistributionFormTemplateProps> = ({
  children,
  sopHeaderData,
  formCode
}) => {
  const headerComponent = sopHeaderData ? (
    <DistributionFormHeader
      documentTitle={sopHeaderData.Doc_Title_en || 'Documentation System'}
      codeNumber={formCode || sopHeaderData.Doc_Code || ''}
      versionNumber={sopHeaderData.Version || ''}
      pageNumber={sopHeaderData.Page_Number || '32 of 42'}
    />
  ) : (
    <div>No Header Data</div>
  );

  const footerComponent = sopHeaderData ? (
    <>
      <DistributionFormApprovalSection
        preparedJobTitle="QA Associate"
        reviewedJobTitle="QA Supervisor"
        approvedJobTitle="QA Manager"
        preparedName={
          sopHeaderData.User_Data_Sop_header_Prepared_ByToUser_Data
            ? `${sopHeaderData.User_Data_Sop_header_Prepared_ByToUser_Data.FName} ${sopHeaderData.User_Data_Sop_header_Prepared_ByToUser_Data.LName}`
            : ''
        }
        reviewedName={
          sopHeaderData.User_Data_Sop_header_reviewed_byToUser_Data
            ? `${sopHeaderData.User_Data_Sop_header_reviewed_byToUser_Data.FName} ${sopHeaderData.User_Data_Sop_header_reviewed_byToUser_Data.LName}`
            : ''
        }
        approvedName={
          sopHeaderData.User_Data_Sop_header_Approved_byToUser_Data
            ? `${sopHeaderData.User_Data_Sop_header_Approved_byToUser_Data.FName} ${sopHeaderData.User_Data_Sop_header_Approved_byToUser_Data.LName}`
            : ''
        }
        preparedSignatureUrl={sopHeaderData.prepared_by_sign || ''}
        reviewedSignatureUrl={sopHeaderData.reviewed_by_sign || ''}
        approvedSignatureUrl={sopHeaderData.approved_by_sign || ''}
        prepared_date={sopHeaderData.prepared_date}
        reviewed_date={sopHeaderData.reviewed_date}
        approved_date={sopHeaderData.approved_date}
      />
      <DistributionFormFooter />
    </>
  ) : null;

  return (
    <div className="distribution-form-wrapper">
      <table className="distribution-form-table">
        <thead>
          <tr>
            <th>
              {headerComponent}
              <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2 style={{ textDecoration: 'underline', fontSize: '18px', fontWeight: 'bold' }}>
                  Distribution Form
                </h2>
              </div>
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td>
              {footerComponent}
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DistributionFormTemplate;
