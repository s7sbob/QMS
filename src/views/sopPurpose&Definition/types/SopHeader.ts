// src/types/SopHeader.ts
export interface SopHeader {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
  Prepared_By: string;      // userId
  Issued_Date: string;      // "2025-02-27T00:00:00.000Z"
  Crt_By: string;
  Crt_Date: string;
  Effective_Date?: string | null;
  Revision_Date?: string | null;
  Com_Id: string;
  Dept_Id: string;
  status?: string | null;
  Is_Active: number;
  NOTES?: string | null;
  // معلومات ارتباطية
  Comp_Data?: {
    Name: string;
  };
  Department_Data?: {
    Dept_name: string;
  };
  User_Data_Sop_header_Prepared_ByToUser_Data?: {
    FName: string;
    LName: string;
  };
  compName: string;
  departmentName: string;
  preparedByName: string;
  // خصائص إضافية للهيدر
  Version?: string;      // رقم الإصدار
  Page_Number?: string;  // رقم الصفحة (يمكن تحديثه ديناميكيًا أثناء التقسيم)
}
