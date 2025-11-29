// src/views/ITManagement/types.ts

/** تحويل حالة is_Active من 1/0 إلى نص */
export function statusToText(isActive: number): string {
    return isActive === 1 ? 'Active' : 'Inactive';
  }
  
  /** واجهة المستخدم */
  export interface IUserData {
    Id: string;
    FName: string;
    LName: string;
    Email: string;
    UserName: string;
    Password?: string;
    DateOfBirth?: string;
    userImg_Url?: string;
    is_Active: number;
  }
  
  /** واجهة المستخدم داخل القسم */
  export interface IDepartmentUser {
    Id: string;
    FName: string | null;
    LName: string | null;
    Email: string;
    Start_Date: string;
    End_Date?: string | null;
    Job_Title: string;
    User_Role: string | null;
    avatarUrl?: string | null;
    Img_url?: string | null;
    userImg_Url?: string | null;
  }
  
  /** واجهة القسم */
  export interface IDepartment {
    Id: string;
    Dept_name: string;
    address?: string;
    Gps_lat?: string;
    Gps_long?: string;
    Dept_manager?: string;
    Dept_PhoneNumber1?: string;
    Dept_phoneNumber2?: string;
    Head_Department: string | null;
    crt_date?: string;
    crt_by?: string | null;
    Modified_date?: string | null;
    Modified_By?: string | null;
    email?: string;
    comp_ID?: string;
    Is_Active: number;
    other_Department_Data?: IDepartment[];
    users?: IDepartmentUser[];
  }
  
  /** واجهة الشركة */
  export interface ICompany {
    Id: string;
    Name: string;
    address?: string;
    Gps_Lat?: string;
    Gps_long?: string;
    Commercial_Reg_Number?: string;
    Tax_Id_Number?: string;
    Commercial_Img_Url?: string;
    TaxId_Img_Url?: string;
    Ceo_id?: string;
    Is_Active: number;
    departments?: IDepartment[];
  }
  
  /** واجهة الدور (UserRole) */
  export interface IUserRole {
    Id: string;
    Name: string;
    Is_Active: number;
  }
  
  /** يحدد إن كان العنصر المختار شركة أم قسم */
  export type SelectedItemType = 'company' | 'department' | null;
  