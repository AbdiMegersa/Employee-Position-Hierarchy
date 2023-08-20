import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  RoleUrl,
  EmployeeUrl,
  RoleTreeNodeData,
  RoleTreeNode,
  RoleDetail,
  RolePotentialParent,
  RoleCreate, 
  Employee,
  EmployeeApi,
  EmployeeBulk,
  FlatRole
} from '../models/Role'

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private http: HttpClient) { }

  fetchAllRoles(): Observable<RoleTreeNode[]> {
    console.log('started Fetching data from APi')
    const url = "http://127.0.0.1:3000/roles?flat=false&depth=10";
    return this.http.get<RoleUrl[]>(url).pipe(
      map(response => {

        const modify = (node: RoleUrl): RoleTreeNode => {

          const styleClass = "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300"

          return {
            expanded: true,
            styleClass,
            type: "person",
            data: {
              id: node.id,
              name: node.name,
              description: node.description,
              employees: node.employees
            },
            children: node.children.map(modify) // recursively modify each child node
          };
        };

        const modifiedRoles: RoleTreeNode[] = response.map((role: RoleUrl) => {
          let roleNode = modify(role);
          if (role.children.length > 0) {
            for (let i = 0; i < role.children.length; ++i) {
              roleNode.children[i] = modify(role.children[i]);
            }
          }
          return roleNode;
        });

        console.log('finished fetching data', modifiedRoles)
        return modifiedRoles;
      })
    );
  }

  // fetchFlatRoles(): Observable<FlatRole[]> {
  //   const url = "http://127.0.0.1:3000/roles?flat=true&depth=10";
  //   return this.http.get<FlatRole[]>(url);
  // }
  // fetchSingleRole(id: string): Observable<RoleDetail> {
  //   const url = `http://127.0.0.1:3000/roles/${id}`;
  //   return this.http.get<RoleDetail>(url)
  // }

  fetchFlatRoles(): Observable<FlatRole[]> {
    const url = "http://127.0.0.1:3000/roles?flat=true&depth=10";
  
    return this.http.get<FlatRole[]>(url).pipe(
      shareReplay() // Enable response caching
    );
  }
  
  fetchSingleRole(id: string): Observable<RoleUrl> {
    const url = `http://127.0.0.1:3000/roles/${id}`;
    // const options = { headers: { 'Accept-Encoding': 'gzip' } }; // Enable gzip compression
  
    return this.http.get<RoleUrl>(url);
  }
  

  fetchRolesExceptDescendant(id: string): Observable<Array<RolePotentialParent>> {
    const url = `http://127.0.0.1:3000/roles/${id}/except_descendants`
    return this.http.get<RolePotentialParent[]>(url);
  }

  fetchEmployees(): Observable<EmployeeApi> {
    const url = "http://127.0.0.1:3000/employees?page=1&limit=50";
    // const opti = { headers: { 'Accept-Encoding': 'gzip' }}
    return this.http.get<EmployeeApi>(url).pipe(
      shareReplay()
    );
  }

  createRole(role: {name: string; description: string; parentId?: string}): Observable<RoleCreate> {
    const url = 'http://127.0.0.1:3000/roles';
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
    let body : {name: string; description: string; parentId?: string} = {
      name: role.name,
      description: role.description,
    }
    if (role.parentId) body = {...body, parentId : role.parentId }

    return this.http.post<RoleCreate>(url, body, { headers })
  }

  updateRole(roleId: string, updatedRole: { name: string; description: string; parentId: string | null }): Observable<RolePotentialParent> {
    console.log(updatedRole)
    const url = `http://127.0.0.1:3000/roles/${roleId}`
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    const body = {
      "name": updatedRole.name,
      "Description": updatedRole.description,
      "parentId": updatedRole.parentId
    };
    console.log('update Role prop: ', updatedRole)
    return this.http.patch<RolePotentialParent>(url, body, { headers });
  }

  updateEmployee(employeeId: string, employeeDetail: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    birthDate: string;
    hireDate: string;
    roleId: string;
    photo: string;
  }) : Observable<any> {
    const url = `http://127.0.0.1:3000/employees/${employeeId}`
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    const body = {
      ...employeeDetail
    }
    return this.http.patch<any>(url, body, {headers});
  }

  deleteRole(roleId: string, parentId: string) {
    const url = `http://127.0.0.1:3000/roles/${roleId}`
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      "parentId": parentId
    }

    const options = {
      headers: headers,
      body: body
    };
    return this.http.delete(url, options);
  }

  createEmployee(employee: Employee): Observable<Employee> {

    const url = "http://127.0.0.1:3000/employees"

    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const body: Employee = {
      ...employee
    }
    console.log(body)
    return this.http.post<Employee>(url, body, { headers });
  }

  deleteEmployee(employeeId: string) : Observable<any>{
    const url = `http://127.0.0.1:3000/employees/${employeeId}`
    return this.http.delete<any>(url);
  }

}


