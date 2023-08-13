import { State, Select, StateContext, Action } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EmployeeApi } from '../models/Role'

import { FetchAll, FetchFlatRoles, FetchRolesSuccess, FetchFlatRolesSuccess, FetchEmployees, FetchEmployeesSuccess } from './role.actions';
import { RoleService } from '../services/role.service';

import { RoleTreeNode, FlatRole } from "../models/Role"

export interface RoleStateModel {
  roles: any;
  flatRoles: any;
  loadingFlat: boolean;
  employees: any;
  loadingEmployees: boolean;
  loading: boolean;
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
    error: ''
  },
})
@Injectable()
export class RoleState {
  constructor(private roleService: RoleService) { }

  @Select((state: { role: RoleStateModel }) => state.role.roles)
  static getRoles(state: RoleStateModel) {
    return state.roles;
  }

  @Select((state: { role: RoleStateModel }) => state.role.employees)
  static getEmployees(state: RoleStateModel) {
    return state.employees;
  }

  @Action(FetchAll)
  fetchAll(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({ loading: true });

    return this.roleService.fetchAllRoles().pipe(
      tap((data: RoleTreeNode[]) => {
        // console.log('data from state ', data)
        console.log('data from api', data)
        ctx.dispatch(new FetchRolesSuccess(data));
      })
    );
  }

  @Action(FetchFlatRoles)
  fetchFlatRoles(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({ loadingFlat: true });

    return this.roleService.fetchFlatRoles().pipe(
      tap((data: FlatRole[]) => {
        console.log('data from api', data)
        ctx.dispatch(new FetchFlatRolesSuccess(data));
      })
    );
  }

  @Action(FetchFlatRolesSuccess)
  fetchFlatRolesSuccess(ctx: StateContext<RoleStateModel>, {payload}: FetchFlatRolesSuccess ){
    ctx.patchState({
      flatRoles: payload,
      loadingFlat: false,
    })
  }

  @Action(FetchEmployees)
  fechAll(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({loadingEmployees: true})

    return this.roleService.fetchEmployees().pipe(
      tap((data: EmployeeApi) => {
        console.log('employee data from api ', data);
        ctx.dispatch(new FetchEmployeesSuccess(data.results))
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
      loading: false,
    });
  }

  @Action(FetchEmployeesSuccess)
  fetchEmployeesSuccess(ctx: StateContext<RoleStateModel>, {payload}: FetchEmployeesSuccess){
    ctx.patchState({
      employees: payload,
      loadingEmployees :false
    })
  }

}
