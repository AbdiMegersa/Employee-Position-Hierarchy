export interface RoleUrl {
  id: string;
  name: string;
  description: string;
  children: Array<RoleUrl>;
  employees: Array<EmployeeUrl>;
  reportsTo: {
    id: string;
    name: string;
    description: string;
  }
}

export interface FlatRole {
  id: string;
  name: string;
  description: string;
  // parentId: string
  employees: Array<EmployeeUrl>;
  reportsTo: {
    id: string;
    name: string;
    description: string;
  }
}

export interface EmployeeUrl {
  birthDate: string;
  email: string;
  fullName: string;
  gender: string;
  hireDate: string;
  id: string;
  phone: string;
  photo: string;
  role?: string;
}

export interface RoleTreeNodeData {
  id: string;
  name: string;
  description: string;
  employees: Array<EmployeeUrl>;
}

export interface RoleTreeNode {
  expanded: boolean;
  styleClass: string;
  type: string;
  data: RoleTreeNodeData;
  children: RoleTreeNode[]
}


export interface RoleDetail extends RoleTreeNodeData {
  reportsTo: {
    id: string;
    description: string;
    name: string;
    reportsTo?: any;
    children?: Array<any>;
    employees: Array<any>;
  } | null;
  parent?: RoleDetail | null;
}

export interface RolePotentialParent extends RoleTreeNodeData {
  parentId: string;
}


export interface RoleCreate {
  id: string;
  name: string,
  description: string;
  reportsTo: any
}

export enum Gender {
  Male = "M",
  Female = "F",
}

export interface Employee {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  hireDate: string;
  roleId: string;
  photo: string;
}

export interface EmployeeApi {
  page: number
  limit: number
  total: number
  pages: number
  results: Array<EmployeeBulk>
}

export interface EmployeeBulk {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  hireDate: string;
  photo: string;
  role: {
    id: string;
    name: string;
    description: string;
    reportsTo: {
      id: string;
      name: string;
      description: string;
    }
  }

}


// {
//   "id": "string",
//   "name": "string",
//   "description": "string",
//   "parentId": "string",
//   "employees": [
//     {
//       "id": "string",
//       "fullName": "string",
//       "email": "string",
//       "phone": "string",
//       "gender": "M",
//       "birthDate": "2023-08-11T13:18:38.658Z",
//       "hireDate": "2023-08-11T13:18:38.658Z",
//       "roleId": "string",
//       "photo": "string",
//       "role": "string"
//     }
//   ]
// }