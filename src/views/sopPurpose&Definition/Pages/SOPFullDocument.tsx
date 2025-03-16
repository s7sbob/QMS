/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axiosServices from 'src/utils/axiosServices';
import { useSearchParams } from 'react-router-dom';

// استيراد القالب والمكونات الفرعية
import SOPTemplate from '../components/SOPTemplate';
import PurposeSection from '../components/PurposeSection';
import DefinitionsSection from '../components/DefinitionsSection';
import ScopeSection from '../components/ScopeSection';
import ProceduresSection from '../components/ProceduresSection';
import ResponsibilitiesSection from '../components/ResponsibilitiesSection';
import SafetyConcernsSection from '../components/SafetyConcernsSection';

// واجهة الداتا الخاصة بتتبع الـ SOP
export interface SopDetailTracking {
  Id: string;
  Sop_HeaderId: string;
  sop_purpose: any;
  Sop_Definitions: any;
  Sop_Scope: any;
  Sop_Procedures: any;
  Sop_Res: any;
  Sop_SafetyConcerns?: any;
  Is_Active: number;
  crt_date: string;
  Sop_header: any;
}

const SOPFullDocument: React.FC = () => {
  const [sopDetail, setSopDetail] = useState<SopDetailTracking | null>(null);
  const [searchParams] = useSearchParams();
  const headerId = searchParams.get('headerId');

  useEffect(() => {
    let url = '';
    if (headerId) {
      url = `/api/sopDetailTracking/getSop?headerId=${headerId}`;
    } else {
      url = `/api/sopDetailTracking/getSop?isCurrent=true`;
    }
    axiosServices
      .get(url)
      .then((res) => {
        const activeRecords = res.data.filter((item: SopDetailTracking) => item.Is_Active === 1);
        if (activeRecords.length > 0) {
          // نستخدم أول سجل نشط للعرض الأولي
          setSopDetail(activeRecords[0]);
        }
      })
      .catch((error) => console.error('Error fetching sop detail tracking data:', error));
  }, [headerId]);

  return (
    <SOPTemplate headerData={sopDetail ? sopDetail.Sop_header : null}>
      <PurposeSection initialData={sopDetail ? sopDetail.sop_purpose : null} />
      <DefinitionsSection initialData={sopDetail ? sopDetail.Sop_Definitions : null} />
      <ScopeSection initialData={sopDetail ? sopDetail.Sop_Scope : null} />
      <ProceduresSection initialData={sopDetail ? sopDetail.Sop_Procedures : null} />
      <ResponsibilitiesSection initialData={sopDetail ? sopDetail.Sop_Res : null} />
      <SafetyConcernsSection initialData={sopDetail ? sopDetail.Sop_SafetyConcerns : null} />
    </SOPTemplate>
  );
};

export default SOPFullDocument;
