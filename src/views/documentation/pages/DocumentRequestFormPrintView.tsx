// src/views/documentation/pages/DocumentRequestFormPrintView.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { IconPrinter } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import DistributionFormHeader from '../components/DistributionFormHeader';
import DistributionFormApprovalSection from '../components/DistributionFormApprovalSection';
import DistributionFormFooter from '../components/DistributionFormFooter';
import '../components/distributionForm.css';

interface DocRequestFormData {
  Id: string;
  sop_HeaderId: string;
  Requested_by: string;
  Request_date: string;
  Reviewed_by: string | null;
  RequestFrm_code: string;
  Reviewed_date: string | null;
  Request_status: number;
  Qa_comment: string;
  Doc_type: string;
  QaMan_Id: string | null;
  QaDoc_officerId: string | null;
  QaManApprove_Date: string | null;
  QaDoc_officerDate: string | null;
  User_Data_DocRequest_frm_Requested_byToUser_Data: any;
  User_Data_DocRequest_frm_Reviewed_byToUser_Data: any;
  User_Data_DocRequest_frm_QaMan_IdToUser_Data: any;
  User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data: any;
  Sop_header: any;
}

interface SopHeaderData {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
  Doc_Title_ar?: string;
  Version?: string;
  Dept_Id?: string;
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
  Department_Data?: {
    Dept_name: string;
  };
}

interface PrintFormData {
  requestCode: string;
  department: string;
  date: string;
  documentTitle: string;
  purpose: string;
  scope: string;
  requestedBy: {
    name: string;
    designation: string;
    signature: string;
    date: string;
  };
  reviewedBy: {
    name: string;
    designation: string;
    signature: string;
    date: string;
  };
  qaComment: string;
  docType: string;
  documentOption: 'new' | 'merge';
  mergeCode: string;
  newDocCode: string;
  qaManager: {
    name: string;
    signature: string;
    date: string;
  };
  docOfficer: {
    name: string;
    signature: string;
    date: string;
  };
}

const DocumentRequestFormPrintView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId');

  const [formData, setFormData] = useState<PrintFormData | null>(null);
  const [sopHeaderData, setSopHeaderData] = useState<SopHeaderData | null>(null);
  const [docRequestForm, setDocRequestForm] = useState<DocRequestFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let docRequest: DocRequestFormData | null = null;
        let sopHeader: SopHeaderData | null = null;

        if (id) {
          // Fetch by doc request form ID
          const response = await axiosServices.get(`/api/docrequest-form/getbyid/${id}`);
          docRequest = response.data;
          setDocRequestForm(docRequest);

          if (docRequest?.sop_HeaderId) {
            const headerResponse = await axiosServices.get(`/api/sopheader/getSopHeaderById/${docRequest.sop_HeaderId}`);
            sopHeader = headerResponse.data;
          }
        } else if (headerId) {
          // Fetch by SOP header ID
          const headerResponse = await axiosServices.get(`/api/sopheader/getSopHeaderById/${headerId}`);
          sopHeader = headerResponse.data;

          // Try to get associated doc request form
          try {
            const docRequestResponse = await axiosServices.get(`/api/docrequest-form/bysopheader/${headerId}`);
            docRequest = docRequestResponse.data;
            setDocRequestForm(docRequest);
          } catch (err) {
            console.log('No doc request form found');
          }
        }

        setSopHeaderData(sopHeader);

        // Load purpose and scope
        let purposeContent = '';
        let scopeContent = '';

        if (sopHeader?.Id) {
          try {
            const purposeRes = await axiosServices.get(`/api/soppurpose/getAllHistory/${sopHeader.Id}`);
            const purposeData = Array.isArray(purposeRes.data) ? purposeRes.data : [];
            const currentPurpose = purposeData.find((p: any) => p.Is_Current === 1) || purposeData[0];
            if (currentPurpose) {
              purposeContent = currentPurpose.Content_en || '';
            }
          } catch (err) {
            console.log('No purpose data found');
          }

          try {
            const scopeRes = await axiosServices.get(`/api/sopScope/getAllHistory/${sopHeader.Id}`);
            const scopeData = Array.isArray(scopeRes.data) ? scopeRes.data : [];
            const currentScope = scopeData.find((s: any) => s.Is_Current === 1) || scopeData[0];
            if (currentScope) {
              scopeContent = currentScope.Content_en || '';
            }
          } catch (err) {
            console.log('No scope data found');
          }
        }

        // Build form data
        setFormData({
          requestCode: docRequest?.RequestFrm_code || '',
          department: sopHeader?.Department_Data?.Dept_name || docRequest?.Sop_header?.Department_Data?.Dept_name || '',
          date: docRequest?.Request_date ? new Date(docRequest.Request_date).toLocaleDateString() : '',
          documentTitle: sopHeader?.Doc_Title_en || '',
          purpose: purposeContent,
          scope: scopeContent,
          requestedBy: {
            name: docRequest?.User_Data_DocRequest_frm_Requested_byToUser_Data
              ? `${docRequest.User_Data_DocRequest_frm_Requested_byToUser_Data.FName} ${docRequest.User_Data_DocRequest_frm_Requested_byToUser_Data.LName}`
              : '',
            designation: 'Requester',
            signature: docRequest?.User_Data_DocRequest_frm_Requested_byToUser_Data?.signUrl || '',
            date: docRequest?.Request_date ? new Date(docRequest.Request_date).toLocaleDateString() : '',
          },
          reviewedBy: {
            name: docRequest?.User_Data_DocRequest_frm_Reviewed_byToUser_Data
              ? `${docRequest.User_Data_DocRequest_frm_Reviewed_byToUser_Data.FName} ${docRequest.User_Data_DocRequest_frm_Reviewed_byToUser_Data.LName}`
              : '',
            designation: 'Department Manager',
            signature: docRequest?.User_Data_DocRequest_frm_Reviewed_byToUser_Data?.signUrl || '',
            date: docRequest?.Reviewed_date ? new Date(docRequest.Reviewed_date).toLocaleDateString() : '',
          },
          qaComment: docRequest?.Qa_comment || '',
          docType: docRequest?.Doc_type || '',
          documentOption: 'new',
          mergeCode: '',
          newDocCode: sopHeader?.Doc_Code || '',
          qaManager: {
            name: docRequest?.User_Data_DocRequest_frm_QaMan_IdToUser_Data
              ? `${docRequest.User_Data_DocRequest_frm_QaMan_IdToUser_Data.FName} ${docRequest.User_Data_DocRequest_frm_QaMan_IdToUser_Data.LName}`
              : '',
            signature: docRequest?.User_Data_DocRequest_frm_QaMan_IdToUser_Data?.signUrl || '',
            date: docRequest?.QaManApprove_Date ? new Date(docRequest.QaManApprove_Date).toLocaleDateString() : '',
          },
          docOfficer: {
            name: docRequest?.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data
              ? `${docRequest.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data.FName} ${docRequest.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data.LName}`
              : '',
            signature: docRequest?.User_Data_DocRequest_frm_QaDoc_officerIdToUser_Data?.signUrl || '',
            date: docRequest?.QaDoc_officerDate ? new Date(docRequest.QaDoc_officerDate).toLocaleDateString() : '',
          },
        });
      } catch (error: any) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, headerId]);

  const handlePrint = () => {
    window.print();
  };

  // Strip HTML tags for plain text display
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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

  if (!formData) {
    return <div>No data available</div>;
  }

  const formCode = docRequestForm?.RequestFrm_code || 'GEN-SOP-FRM-001.007/01';

  return (
    <>
      <Box className="no-print" sx={{ mb: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          startIcon={<IconPrinter />}
        >
          Print Document Request Form
        </Button>
      </Box>

      <div className="distribution-form-wrapper">
        <table className="distribution-form-table">
          <thead>
            <tr>
              <th>
                {sopHeaderData ? (
                  <DistributionFormHeader
                    documentTitle="Documentation System"
                    codeNumber={formCode}
                    versionNumber={sopHeaderData.Version || '12'}
                    pageNumber="38 of 42"
                  />
                ) : (
                  <div>No Header Data</div>
                )}
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                  <h2 style={{ textDecoration: 'underline', fontSize: '18px', fontWeight: 'bold' }}>
                    New document request form
                  </h2>
                </div>
              </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                {sopHeaderData && (
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
                )}
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td>
                <div style={{ padding: '20px' }}>
                  {/* Row 1: Requested code, Department, Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <strong>Requested code:</strong>{' '}
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '150px', paddingLeft: '5px' }}>
                        {formData.requestCode}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>Department:</strong>{' '}
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '150px', paddingLeft: '5px' }}>
                        {formData.department}
                      </span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <strong>Date:</strong>{' '}
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', minWidth: '100px', paddingLeft: '5px' }}>
                        {formData.date}
                      </span>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <strong>Document Title:</strong>{' '}
                    <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: 'calc(100% - 120px)', paddingLeft: '5px' }}>
                      {formData.documentTitle}
                    </span>
                  </div>

                  {/* Purpose Section */}
                  <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <strong style={{ textDecoration: 'underline' }}>Purpose:</strong>
                    </div>
                    <div style={{ minHeight: '40px', paddingLeft: '10px' }}>
                      {stripHtml(formData.purpose)}
                    </div>
                  </div>

                  {/* Scope Section */}
                  <div style={{ marginBottom: '20px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <strong style={{ textDecoration: 'underline' }}>Scope:</strong>
                    </div>
                    <div style={{ minHeight: '40px', paddingLeft: '10px' }}>
                      {stripHtml(formData.scope)}
                    </div>
                  </div>

                  {/* Requested By / Reviewed By Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', width: '50%' }} colSpan={2}>
                          Requested by
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', width: '50%' }} colSpan={2}>
                          Reviewed By
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '15%' }}>Name</td>
                        <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>{formData.requestedBy.name}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '15%' }}>Name</td>
                        <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>{formData.reviewedBy.name}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Designation</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.requestedBy.designation}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Designation</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.reviewedBy.designation}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Signature</td>
                        <td style={{ border: '1px solid #000', padding: '6px', height: '50px' }}>
                          {formData.requestedBy.signature && (
                            <img src={formData.requestedBy.signature} alt="Signature" style={{ maxHeight: '45px' }} />
                          )}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Signature</td>
                        <td style={{ border: '1px solid #000', padding: '6px', height: '50px' }}>
                          {formData.reviewedBy.signature && (
                            <img src={formData.reviewedBy.signature} alt="Signature" style={{ maxHeight: '45px' }} />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Date</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.requestedBy.date}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Date</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.reviewedBy.date}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* QA Manager Section */}
                  <div style={{ marginBottom: '15px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>QA Manager:</div>
                    <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                      <span>-</span>
                      <span style={{ marginLeft: '10px' }}>Comment/Decision:</span>
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: 'calc(100% - 200px)', marginLeft: '10px', minHeight: '20px' }}>
                        {stripHtml(formData.qaComment)}
                      </span>
                      <span style={{ border: '1px solid #000', display: 'inline-block', width: '15px', height: '15px', marginLeft: '10px', verticalAlign: 'middle' }}></span>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                      <span>-</span>
                      <span style={{ marginLeft: '10px' }}>Type of document:</span>
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: '200px', marginLeft: '10px' }}>
                        {formData.docType}
                      </span>
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '8px' }}>
                      <span style={{ border: '1px solid #000', display: 'inline-block', width: '15px', height: '15px', marginRight: '5px', verticalAlign: 'middle' }}>
                        {formData.documentOption === 'merge' ? '✓' : ''}
                      </span>
                      <span>Merge with existing document code</span>
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: '200px', marginLeft: '10px' }}>
                        {formData.mergeCode}
                      </span>
                      <span style={{ marginLeft: '20px' }}>
                        <span style={{ border: '1px solid #000', display: 'inline-block', width: '15px', height: '15px', marginRight: '5px', verticalAlign: 'middle' }}>
                          {formData.documentOption === 'new' ? '✓' : ''}
                        </span>
                        <span>New</span>
                      </span>
                    </div>
                  </div>

                  {/* QA Document Officer Section */}
                  <div style={{ marginBottom: '20px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>QA Document Officer:</div>
                    <div style={{ marginLeft: '20px' }}>
                      <span>-</span>
                      <span style={{ marginLeft: '10px' }}>New Document Code:</span>
                      <span style={{ borderBottom: '1px dotted #000', display: 'inline-block', width: '300px', marginLeft: '10px' }}>
                        {formData.newDocCode}
                      </span>
                    </div>
                  </div>

                  {/* QA Manager Approval / Document Officer Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', width: '50%' }} colSpan={2}>
                          QA Manager approval
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0', width: '50%' }} colSpan={2}>
                          QA Document Officer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '15%' }}>Name</td>
                        <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>{formData.qaManager.name}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '15%' }}>Name</td>
                        <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>{formData.docOfficer.name}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Signature</td>
                        <td style={{ border: '1px solid #000', padding: '6px', height: '50px' }}>
                          {formData.qaManager.signature && (
                            <img src={formData.qaManager.signature} alt="Signature" style={{ maxHeight: '45px' }} />
                          )}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Signature</td>
                        <td style={{ border: '1px solid #000', padding: '6px', height: '50px' }}>
                          {formData.docOfficer.signature && (
                            <img src={formData.docOfficer.signature} alt="Signature" style={{ maxHeight: '45px' }} />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Date</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.qaManager.date}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Date</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{formData.docOfficer.date}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Form Code */}
                  <div style={{ fontSize: '12px', marginTop: '20px' }}>
                    <strong>Code #: {formCode}</strong>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentRequestFormPrintView;
