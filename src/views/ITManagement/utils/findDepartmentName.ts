// src/views/ITManagement/utils/findDepartmentName.ts

import { ICompany, IDepartment } from '../types';

export function findDepartmentNameById(companies: ICompany[], deptId: string): string {
  for (const company of companies) {
    if (!company.departments) continue;
    const found = findDeptRecursive(company.departments, deptId);
    if (found) return found.Dept_name;
  }
  return "N/A";
}

function findDeptRecursive(list: IDepartment[], deptId: string): IDepartment | null {
  for (const dept of list) {
    if (dept.Id === deptId) return dept;
    if (dept.other_Department_Data && dept.other_Department_Data.length > 0) {
      const found = findDeptRecursive(dept.other_Department_Data, deptId);
      if (found) return found;
    }
  }
  return null;
}
