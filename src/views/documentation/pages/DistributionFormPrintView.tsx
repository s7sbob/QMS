// src/views/documentation/pages/DistributionFormPrintView.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { IconPrinter } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import DistributionFormTemplate from '../components/DistributionFormTemplate';

interface CopyDetail {
  id?: string;
  copyNumber: string;
  departmentId: string;
  receivedBy: string;
  receivedSign: string;
  receivedDate: string;
  departmentName?: string;
  userName?: string;
}

interface DistributionFormData {
  documentType: string;
  documentCode: string;
  documentTitle: string;
  version?: string;
  issueDate: string;
  revisionDate: string;
  numberOfCopies: string;
  destruction: string;
  copies: CopyDetail[];
  formCode?: string;
}

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

interface Department {
  Id: string;
  Dept_name: string;
}

interface DeptUser {
  Id: string;
  FName: string;
  LName: string;
}

interface DistributionFormRecord {
  Id: string;
  Sop_headerId: string;
  Dept_Id: string;
  user_Id: string;
  copy_number: number;
  Number_OfCopies: number;
  frm_code?: string;
  Department_Data?: Department;
  User_Data?: DeptUser;
}

const normalizeApiArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
};

const DistributionFormPrintView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId');

  const [formData, setFormData] = useState<DistributionFormData | null>(null);
  const [sopHeaderData, setSopHeaderData] = useState<SopHeaderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!headerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch SOP header data
        console.log('Fetching SOP header for headerId:', headerId);
        const sopHeaderResponse = await axiosServices.get(`/api/sopheader/getSopHeaderById/${headerId}`);
        console.log('SOP header response:', sopHeaderResponse.data);
        const sopHeader = sopHeaderResponse.data as SopHeaderData;
        setSopHeaderData(sopHeader);

        // Fetch distribution form records
        console.log('Fetching distribution forms for headerId:', headerId);
        const distributionResponse = await axiosServices.get(
          `/api/distributionForm/getdistribution-forms/sop/${headerId}`
        );
        console.log('Distribution forms response:', distributionResponse.data);
        const records = normalizeApiArray<DistributionFormRecord>(distributionResponse.data);

        if (records.length > 0) {
          const copies: CopyDetail[] = records.map((record, index) => ({
            id: record.Id,
            copyNumber: (index + 1).toString(),
            departmentId: record.Dept_Id || '',
            receivedBy: record.user_Id || '',
            receivedSign: '',
            receivedDate: '',
            departmentName: record.Department_Data?.Dept_name || '',
            userName: record.User_Data
              ? `${record.User_Data.FName} ${record.User_Data.LName}`
              : '',
          }));

          // Get user signatures
          for (let i = 0; i < copies.length; i++) {
            const userId = records[i].user_Id;
            if (userId) {
              try {
                const userResponse = await axiosServices.get(`/api/department/getdepartment/${records[i].Dept_Id}`);
                const usersData = userResponse.data;

                // Extract users from the response
                let users: DeptUser[] = [];
                if (usersData && typeof usersData === 'object' && 'Users_Departments' in usersData) {
                  const dept = usersData as any;
                  users = dept.Users_Departments?.map((ud: any) => {
                    const user = ud.User_Data_Users_Departments_User_IdToUser_Data;
                    return {
                      Id: user?.Id || ud.User_Id || '',
                      FName: user?.FName || '',
                      LName: user?.LName || '',
                      signUrl: user?.signUrl ?? null,
                    };
                  }) || [];
                }

                const user = users.find(u => u.Id === userId);
                if (user && (user as any).signUrl) {
                  copies[i].receivedSign = (user as any).signUrl;
                  copies[i].receivedDate = new Date().toLocaleDateString();
                }
              } catch (err) {
                console.error('Error loading user signature:', err);
              }
            }
          }

          const formCode = records[0].frm_code || `${sopHeader.Doc_Code}-FRM-001.002/03`;

          setFormData({
            documentType: 'SOP',
            documentCode: sopHeader.Doc_Code,
            documentTitle: sopHeader.Doc_Title_en,
            version: sopHeader.Version,
            issueDate: sopHeader.Issued_Date || '',
            revisionDate: sopHeader.Revision_Date || '',
            numberOfCopies: records[0]?.Number_OfCopies?.toString() || '',
            destruction: '',
            copies,
            formCode,
          });
        }
      } catch (error: any) {
        console.error('Error fetching distribution form data:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        alert(`Error loading data: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [headerId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" mt={2} color="primary">
          Loading data...
        </Typography>
      </Box>
    );
  }

  if (!formData || !sopHeaderData) {
    return <div>No data available</div>;
  }

  return (
    <>
      <Box className="no-print" sx={{ mb: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          startIcon={<IconPrinter />}
        >
          Print Distribution Form
        </Button>
      </Box>

      <DistributionFormTemplate sopHeaderData={sopHeaderData} formCode={formData.formCode}>
        <div style={{ padding: '20px' }}>
          {/* Document Information */}
          <div style={{ marginBottom: '30px' }}>
            {/* Row 1: Document Type and Document Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <div style={{ flex: 1, marginRight: '40px' }}>
                <strong>Document Type:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '200px', paddingLeft: '5px' }}>{formData.documentType}</span>
              </div>
              <div style={{ flex: 1 }}>
                <strong>Document Code:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '200px', paddingLeft: '5px' }}>{formData.documentCode}</span>
              </div>
            </div>

            {/* Row 2: Document Title */}
            <div style={{ marginBottom: '15px', fontSize: '14px' }}>
              <strong>Document Title:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: 'calc(100% - 140px)', paddingLeft: '5px' }}>{formData.documentTitle}</span>
            </div>

            {/* Row 3: Version, Issue date, Revision date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <div style={{ flex: '0 0 25%', marginRight: '20px' }}>
                <strong>Version #:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '80px', paddingLeft: '5px' }}>{formData.version || ''}</span>
              </div>
              <div style={{ flex: '0 0 35%', marginRight: '20px' }}>
                <strong>Issue date:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '120px', paddingLeft: '5px' }}>{formData.issueDate ? new Date(formData.issueDate).toLocaleDateString() : ''}</span>
              </div>
              <div style={{ flex: '0 0 35%' }}>
                <strong>Revision date:</strong> <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '120px', paddingLeft: '5px' }}>{formData.revisionDate ? new Date(formData.revisionDate).toLocaleDateString() : ''}</span>
              </div>
            </div>
          </div>

          {/* Distribution Table */}
          <table className="distribution-table" style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', verticalAlign: 'middle' }}>
                  Department
                </th>
                <th colSpan={4} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  Approved Copies Distribution
                </th>
                <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', verticalAlign: 'middle' }}>
                  Destruction when obsoletes<br />(QA Signature/Date)
                </th>
              </tr>
              <tr>
                <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                  No. of<br />copies
                </th>
                <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                  Copy<br />#
                </th>
                <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                  Received by<br />(Name)
                </th>
                <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                  Sign/Date
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.copies.map((copy, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    {copy.departmentName}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                    {formData.numberOfCopies}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                    {copy.copyNumber}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    {copy.userName}
                  </td>
                  <td className="signature-cell" style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                    {copy.receivedSign ? (
                      <div>
                        <img
                          src={copy.receivedSign}
                          alt="Signature"
                          style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain' }}
                        />
                        <div>{copy.receivedDate}</div>
                      </div>
                    ) : (
                      <div style={{ height: '60px' }}></div>
                    )}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    <div style={{ height: '60px' }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Form Code */}
          {formData.formCode && (
            <div style={{ marginTop: '30px', marginBottom: '20px', fontSize: '12px' }}>
              <strong>Form #: {formData.formCode}</strong>
            </div>
          )}
        </div>
      </DistributionFormTemplate>
    </>
  );
};

export default DistributionFormPrintView;
