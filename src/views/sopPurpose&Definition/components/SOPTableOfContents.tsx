// src/components/SOPTableOfContents.tsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SopHeader } from '../types/SopHeader';
import SOPContentPageHeader from './SOPContentPageHeader';
import PreparedBySection from './PreparedBySection';
import Footer from './Footer';
import { UserContext } from 'src/context/UserContext';
import axiosServices from 'src/utils/axiosServices';

// Define the structure for table of contents entries
export interface TableOfContentsEntry {
  serial: string;
  contentEn: string;
  contentAr: string;
  pageNumber: number | string;
  isSubItem?: boolean;
}

interface SOPTableOfContentsProps {
  headerData: SopHeader | null;
  totalPages: number;
  entries: TableOfContentsEntry[];
  onEntriesChange?: (entries: TableOfContentsEntry[]) => void;
}

// Convert number to Arabic-Indic numerals
const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => {
    const digit = parseInt(d);
    return isNaN(digit) ? d : arabicNumerals[digit];
  }).join('');
};

const SOPTableOfContents: React.FC<SOPTableOfContentsProps> = ({
  headerData,
  totalPages,
  entries: initialEntries,
  onEntriesChange,
}) => {
  const user = useContext(UserContext);
  const userRole = user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';
  const isQAAssociate = userRole === 'QA Associate';

  // Allow editing if user is QA Associate OR document status is 1 (In Progress) or 16 (Approved by Doc Officer)
  const canEdit = isQAAssociate || headerData?.status === '1' || headerData?.status === '16';

  const [entries, setEntries] = useState<TableOfContentsEntry[]>(initialEntries);
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setEntries(initialEntries);
    setHasChanges(false);
  }, [initialEntries]);

  if (!headerData) return null;

  // Prepare user names
  const preparedName = headerData?.User_Data_Sop_header_Prepared_ByToUser_Data
    ? `${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.FName} ${headerData.User_Data_Sop_header_Prepared_ByToUser_Data.LName}`
    : '';
  const reviewedName = headerData?.User_Data_Sop_header_reviewed_byToUser_Data
    ? `${headerData.User_Data_Sop_header_reviewed_byToUser_Data.FName} ${headerData.User_Data_Sop_header_reviewed_byToUser_Data.LName}`
    : '';
  const approvedName = headerData?.User_Data_Sop_header_Approved_byToUser_Data
    ? `${headerData.User_Data_Sop_header_Approved_byToUser_Data.FName} ${headerData.User_Data_Sop_header_Approved_byToUser_Data.LName}`
    : '';

  // Total rows to display (reduced to fit footer)
  const totalRowsNeeded = 18;
  const emptyRowsCount = Math.max(0, totalRowsNeeded - entries.length);
  const emptyRows = Array(emptyRowsCount).fill(null);

  // Prepare footer data
  const footerData = useMemo(() => {
    if (!headerData) return null;

    return {
      preparedName,
      reviewedName,
      approvedName,
      stampImageUrl: headerData?.sop_stamp_url || './public/Stamps/QaApproval.svg',
      preparedSignatureUrl: headerData?.prepared_by_sign || '',
      reviewedSignatureUrl: headerData?.reviewed_by_sign || '',
      approvedSignatureUrl: headerData?.approved_by_sign || '',
      prepared_date: headerData?.prepared_date,
      reviewed_date: headerData?.reviewed_date,
      approved_date: headerData?.approved_date,
    };
  }, [headerData, preparedName, reviewedName, approvedName]);

  // Handle cell edit
  const handleCellClick = (rowIndex: number, field: string) => {
    if (canEdit) {
      setEditingCell({ row: rowIndex, field });
    }
  };

  // Handle cell value change
  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const newEntries = [...entries];
    if (rowIndex < entries.length) {
      newEntries[rowIndex] = { ...newEntries[rowIndex], [field]: field === 'pageNumber' ? (parseInt(value) || '') : value };
    }
    setEntries(newEntries);
    setHasChanges(true);
  };

  // Handle cell blur - close editing mode
  const handleCellBlur = () => {
    setEditingCell(null);
  };

  // Handle save to database
  const handleSave = async () => {
    if (!headerData?.Id) return;

    setIsSaving(true);
    try {
      await axiosServices.post('/api/sopheader/addEditSopHeader', {
        Id: headerData.Id,
        Content_Table: JSON.stringify(entries),
      });
      if (onEntriesChange) {
        onEntriesChange(entries);
      }
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving table of contents:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding new row when clicking empty row
  const handleEmptyRowClick = (field: string) => {
    if (!canEdit) return;

    const nextSerial = entries.filter(e => !e.isSubItem).length + 1;
    const newEntry: TableOfContentsEntry = {
      serial: nextSerial.toString(),
      contentEn: '',
      contentAr: '',
      pageNumber: '',
      isSubItem: false,
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    setEditingCell({ row: newEntries.length - 1, field });
    setHasChanges(true);
  };

  // Render editable cell
  const renderEditableCell = (rowIndex: number, field: string, value: string | number, style: React.CSSProperties) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.field === field;

    if (isEditing && canEdit) {
      return (
        <input
          type={field === 'pageNumber' ? 'number' : 'text'}
          value={value}
          onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
          onBlur={handleCellBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleCellBlur()}
          autoFocus
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '9px',
            textAlign: style.textAlign as 'left' | 'center' | 'right',
            direction: style.direction as 'ltr' | 'rtl',
            padding: 0,
          }}
        />
      );
    }

    return (
      <span
        onClick={() => handleCellClick(rowIndex, field)}
        style={{
          cursor: canEdit ? 'text' : 'default',
          display: 'block',
          minHeight: '12px',
        }}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="sop-page sop-toc-page" style={{ marginBottom: '25px' }}>
      {/* Page Header */}
      <SOPContentPageHeader
        headerData={headerData}
        currentPage={2}
        totalPages={totalPages}
      />

      {/* Table of Contents */}
      <div style={{ flex: 1, padding: '3px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
          {/* Table Title Header */}
          <thead>
            <tr>
              <th
                colSpan={3}
                style={{
                  backgroundColor: 'rgba(197, 217, 241, 1)',
                  padding: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: '2px solid #000',
                  textAlign: 'center',
                }}
              >
                Table of contents
              </th>
              <th
                colSpan={3}
                style={{
                  backgroundColor: 'rgba(197, 217, 241, 1)',
                  padding: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: '2px solid #000',
                  textAlign: 'center',
                  direction: 'rtl',
                }}
              >
                قائمة المحتويات
              </th>
            </tr>
            {/* Column Headers */}
            <tr style={{ backgroundColor: 'rgba(231, 238, 248, 1)' }}>
              <th style={{ border: '1px solid #000', padding: '4px', width: '4%',textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>S</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '32%', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>Content</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '7%', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>Page<br/>number</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '7%', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' ,direction: 'rtl' }}>رقم<br/>الصفحة</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '32%', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', direction: 'rtl' }}>المحتوى</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '4%', fontWeight: 'bold', fontSize: '12px',textAlign: 'center', direction: 'rtl' }}>م</th>
            </tr>
          </thead>
          <tbody>
            {/* Data Rows */}
            {entries.map((entry, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px', height: '16px' }}>
                  {entry.isSubItem ? '-' : entry.serial}
                </td>
                <td style={{
                  border: '1px solid #000',
                  padding: '2px',
                  fontSize: '9px',
                  paddingLeft: entry.isSubItem ? '12px' : '4px',
                }}>
                  {renderEditableCell(index, 'contentEn', entry.isSubItem ? `- ${entry.contentEn}` : entry.contentEn, { textAlign: 'left', direction: 'ltr' })}
                </td>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px' }}>
                  {renderEditableCell(index, 'pageNumber', entry.pageNumber, { textAlign: 'center', direction: 'ltr' })}
                </td>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px', direction: 'rtl' }}>
                  {typeof entry.pageNumber === 'number' ? toArabicNumerals(entry.pageNumber) : entry.pageNumber}
                </td>
                <td style={{
                  border: '1px solid #000',
                  padding: '2px',
                  textAlign: 'right',
                  direction: 'rtl',
                  fontSize: '9px',
                  paddingRight: entry.isSubItem ? '12px' : '4px',
                }}>
                  {renderEditableCell(index, 'contentAr', entry.isSubItem ? `${entry.contentAr} -` : entry.contentAr, { textAlign: 'right', direction: 'rtl' })}
                </td>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px', direction: 'rtl' }}>
                  {entry.isSubItem ? '-' : (entry.serial ? toArabicNumerals(entry.serial) : '')}
                </td>
              </tr>
            ))}
            {/* Empty Rows to fill the page */}
            {emptyRows.map((_, index) => (
              <tr key={`empty-${index}`}>
                <td
                  style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px', height: '16px', cursor: canEdit ? 'pointer' : 'default' }}
                  onClick={() => handleEmptyRowClick('serial')}
                >&nbsp;</td>
                <td
                  style={{ border: '1px solid #000', padding: '2px', fontSize: '9px', cursor: canEdit ? 'pointer' : 'default' }}
                  onClick={() => handleEmptyRowClick('contentEn')}
                >&nbsp;</td>
                <td
                  style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px', cursor: canEdit ? 'pointer' : 'default' }}
                  onClick={() => handleEmptyRowClick('pageNumber')}
                >&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px' }}>&nbsp;</td>
                <td
                  style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontSize: '9px', cursor: canEdit ? 'pointer' : 'default' }}
                  onClick={() => handleEmptyRowClick('contentAr')}
                >&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontSize: '9px' }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save Button - appears when there are unsaved changes */}
        {hasChanges && canEdit && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
            marginBottom: '10px'
          }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {isSaving ? 'Saving...' : 'Save Table of Contents'}
            </button>
          </div>
        )}
      </div>

      {/* Footer Section - Standard PreparedBySection and Footer */}
      {footerData && (
        <div className="content-footer-section">
          <PreparedBySection
            preparedJobTitle="QA Associate"
            reviewedJobTitle="QA Supervisor"
            approvedJobTitle="QA Manager"
            preparedName={footerData.preparedName}
            reviewedName={footerData.reviewedName}
            approvedName={footerData.approvedName}
            stampImageUrl={footerData.stampImageUrl}
            preparedSignatureUrl={footerData.preparedSignatureUrl}
            reviewedSignatureUrl={footerData.reviewedSignatureUrl}
            approvedSignatureUrl={footerData.approvedSignatureUrl}
            prepared_date={footerData.prepared_date}
            reviewed_date={footerData.reviewed_date}
            approved_date={footerData.approved_date}
          />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default SOPTableOfContents;
