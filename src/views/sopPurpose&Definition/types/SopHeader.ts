// src/types/SopHeader.ts
export interface SopHeader {
  Id: string;
  Doc_Code: string;
  Doc_Title_en: string;
  Doc_Title_ar: string;
  Prepared_By: string;      // userId
  Issued_Date: string | null; // مثال: "2025-02-27T00:00:00.000Z"
  Crt_By: string;
  Crt_Date: string;
  Effective_Date?: string | null;
  Revision_Date?: string | null;
  Com_Id: string;
  Dept_Id: string;
  status?: string;          // حالة الـ SOP (مثلاً "1", "2", ...)
  Is_Active: number;
  NOTES?: string | null;
  prepared_date: string;
  reviewed_date: string;
  approved_date: string;
  // معلومات الارتباط
  Comp_Data?: {
    Name: string;
  };
  Department_Data?: {
    Dept_name: string;
  };
  // بيانات المستخدمين المرتبطة بالتوقيعات
  User_Data_Sop_header_Prepared_ByToUser_Data?: {
    FName: string;
    LName: string;
    signUrl?: string;
  };
  User_Data_Sop_header_reviewed_byToUser_Data?: {
    FName: string;
    LName: string;
    signUrl?: string;
  };
  User_Data_Sop_header_Approved_byToUser_Data?: {
    FName: string;
    LName: string;
    signUrl?: string;
  };
  compName: string;
  departmentName: string;
  // بيانات التواقيع والعلامات (تُسترجع من الـ API)
  prepared_by_sign?: string;
  reviewed_by_sign?: string;
  approved_by_sign?: string;
  // بيانات إضافية تُستخدم لعرض الختم والاعتماد
  sop_stamp_url?: string;
  reviewed_by?: string;
  Approved_by?: string;
  // خصائص إضافية للهيدر
  Version?: string;         // رقم الإصدار
  Page_Number?: string;     // رقم الصفحة (يمكن تحديثه أثناء التقسيم)
  Content_Table?: string | null; // JSON string for table of contents
}
