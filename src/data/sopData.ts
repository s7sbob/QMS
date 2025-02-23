// src/data/sopData.ts
export interface SOP {
  id: number;
  title: string;
  version: string;
  department: string;
  status: string;
  companyName: string;
  preparedBy: string;
  pdfUrl: string;
}

const sopData: SOP[] = [
  {
    id: 1,
    title: 'Quality Manual',
    version: '2.0',
    department: 'Quality',
    status: 'Active',
    companyName: 'CIGALAH',
    preparedBy: 'Ahmed Rabie',
    pdfUrl: '/documents/quality-manual.pdf'
  },
  {
    id: 2,
    title: 'Document Control',
    version: '1.5',
    department: 'Quality',
    status: 'Under Review',
    companyName: 'CIGALAH',
    preparedBy: 'Mohamed Ali',
    pdfUrl: '/documents/document-control.pdf'
  },
];

export default sopData;
