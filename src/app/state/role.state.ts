import { State, Select, StateContext, Action, createSelector} from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs'
import { EmployeeApi } from '../models/Role'

import { FetchAll, FetchFlatRoles, FetchRolesSuccess, FetchFlatRolesSuccess, FetchEmployees, FetchEmployeesSuccess, FetchRolesFail, FetchEmployeesFail, FetchFlatRolesFail } from './role.actions';
import { RoleService } from '../services/role.service';

import { RoleTreeNode, FlatRole, EmployeeBulk,  } from "../models/Role"
import { NzMessageService } from 'ng-zorro-antd/message';

export interface RoleStateModel {
  roles: Array<RoleTreeNode>;
  flatRoles: Array<FlatRole>;
  employees: Array<EmployeeBulk>;
  loadingFlat: boolean;
  loadingEmployees: boolean;
  loading: boolean;
  rolesError: string;
  flatRolesError: string;
  employeesError: string
  error: string;
}

@State<RoleStateModel>({
  name: 'role',
  defaults: {
    roles: [],
    flatRoles: [],
    employees: [],
    loadingFlat: false,
    loadingEmployees: false,
    loading: false,
    rolesError: "",
    flatRolesError: "",
    employeesError: "",
    error: ''
  },
})
@Injectable()
export class RoleState {
  constructor(private roleService: RoleService, private message: NzMessageService) { }

  static getEmployees(state: RoleStateModel) {
    return state.employees;
  }

  static getFlatRoles() {
    return createSelector([RoleState], (state: RoleStateModel) => state.flatRoles);
  }

  static employeesSelector() {
    return createSelector([RoleState], (state: RoleStateModel) => state.employees);
  }

  @Select((state: { role: RoleStateModel }) => state.role.roles)
  static getRoles(state: RoleStateModel) {
    return state.roles;
  }

 
  @Action(FetchAll)
  fetchAll(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({ loading: true });

    return this.roleService.fetchAllRoles().pipe(
      tap((data: RoleTreeNode[]) => {
        // console.log('data from state ', data)
        if(data){
          console.log('data from api', data)
          ctx.dispatch(new FetchRolesSuccess(data));
        }else{
          ctx.dispatch(new FetchRolesFail("Roles Couldnt be fetched from database"))
        }
      })
    );
  }

  @Action(FetchFlatRoles)
  fetchFlatRoles(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({ loadingFlat: true });

    return this.roleService.fetchFlatRoles().pipe(
      tap((data: FlatRole[]) => {
        if(data){
          console.log('data from api', data)
          ctx.dispatch(new FetchFlatRolesSuccess(data));
        }else{
          ctx.dispatch(new FetchFlatRolesFail("Flat Roles Couldn\'t be fetched from database"))
        }
      })
    );
  }

  @Action(FetchFlatRolesSuccess)
  fetchFlatRolesSuccess(ctx: StateContext<RoleStateModel>, {payload}: FetchFlatRolesSuccess ){
    ctx.patchState({
      flatRoles: payload,
      flatRolesError: "",
      loadingFlat: false,
    })
  }

  @Action(FetchEmployees)
  fechAll(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({loadingEmployees: true})

    return this.roleService.fetchEmployees().pipe(
      tap((data: EmployeeApi) => {
        if(data.results){
          console.log('employee data from api ', data);
          ctx.dispatch(new FetchEmployeesSuccess(data.results))
        }else{
          ctx.dispatch(new FetchEmployeesFail("Employees Couldn\'t be fetched from Database"))
        }
      })
    )

  }

  @Action(FetchRolesSuccess)
  fetchRolesSuccess(
    ctx: StateContext<RoleStateModel>,
    { payload }: FetchRolesSuccess
  ) {
    console.log('payload looks like: ', payload);
    ctx.patchState({
      roles: payload,
      rolesError: "",
      loading: false,
    });
  }

  @Action(FetchEmployeesSuccess)
  fetchEmployeesSuccess(ctx: StateContext<RoleStateModel>, {payload}: FetchEmployeesSuccess){
    ctx.patchState({
      employees: payload,
      employeesError: "",
      loadingEmployees :false
    })
  }

  @Action(FetchRolesFail)
  fetchRolesFail(ctx: StateContext<RoleStateModel>, {payload}: FetchRolesFail) {
    this.message.error('Roles Couldnot be fetched')
    ctx.patchState({
      rolesError: payload
    })
  }

  @Action(FetchEmployeesFail)
  fetchEmployeesFail(ctx: StateContext<RoleStateModel>, {payload}: FetchEmployeesFail) {
    this.message.error('Employess Couldnot be fetched')
    ctx.patchState({
      employeesError: payload
    })
  }

  @Action(FetchFlatRolesFail)
  fetchFlatRolesFail(ctx: StateContext<RoleStateModel>, {payload}: FetchFlatRolesFail) {
    this.message.error('Flat Roles Couldnot be fetched')
    ctx.patchState({
      flatRolesError: payload
    })
  }

}
