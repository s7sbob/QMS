// src/types/dashboard.types.ts
export interface FormItem {
  title: string;
  path: string;
  description: string;
}

export interface FormSection {
  title: string;
  description: string;
  forms: FormItem[];
}

export interface DashboardModule {
  id: string;
  title: string;
  icon: string;
  path: string;
  description: string;
  external?: boolean;
  forms: FormItem[];
  sections?: FormSection[]; // إضافة الـ sections للتقسيم
  layoutType?: 'default' | 'split'; // نوع التخطيط
}

export interface DashboardConfig {
  [key: string]: DashboardModule;
}
