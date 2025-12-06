// src/views/sopPurpose&Definition/types/SopStatus.ts

export interface SopStatus {
  Id: string;
  Name_en: string;
  Name_ar: string | null;
  Is_Active: number;
  order: number | null;
}
