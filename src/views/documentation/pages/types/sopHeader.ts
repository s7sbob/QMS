// src/types/sopHeader.ts

/**
 * حقل مُمَثِّل بيانات المستخدم في التواقيع
 */
export interface RequestedBy {
  name: string;
  designation: string;
  signature: string;
  date: string;
}

/**
 * الحقول التي يرسلها الواجهة (Front-end) إلى API لإنشاء/تعديل SOP Header
 */
export interface SopHeaderInput {
  Id?: string | null;           // لعمليات التعديل
  Doc_Code?: string | null;     // رمز المستند (اختياري إنشائي)
  Doc_Title_en: string;         // العنوان الإنجليزي
  Doc_Title_ar?: string | null; // العنوان العربي
  Dept_Id?: string | null;      // قسم المستند
  Issued_Date?: Date | null;    // تاريخ الإصدار
  Effective_Date?: Date | null; // تاريخ السريان
  status?: string | null;       // كود الحالة
  NOTES?: string | null;        // ملاحظات QA
  doc_Type?: string | null;     // نوع المستند (مثلاً "SOP")
  dept_code?: string | null;    // كود القسم
  Is_Active?: number | null;    // 1 أو 0 لتفعيل/أرشفة
}

/**
 * نموذج الفورم الكامل في الواجهة مع الحقول الإضافية
 */
export interface SopHeaderFormState {
  Id?: string | null;
  requestedCode: string;
  department: string;
  date: string;
  effectiveDate: string;
  docTitle: string;
  docTitleAr: string;
  purpose: string;
  scope: string;
  requested: RequestedBy;
  reviewed: RequestedBy;
  qaComment: string;
  docType: string;
  status: string;
  deptCode: string;
  isActive: boolean;
  mergeExisting: boolean;
  mergeCode: string;
  qaNew: boolean;
  qaNewCode: string;
  qaManager: RequestedBy;
  docOfficer: RequestedBy;
}
