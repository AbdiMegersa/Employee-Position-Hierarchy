import { RoleTreeNode, EmployeeBulk, FlatRole } from '../models/Role'

export class FetchAll {
    static readonly type = "[App Component] Fetch Roles";
}

export class FetchFlatRoles {
    static readonly type = "[App Component] Fetch Flat Roles";
}

export class FetchEmployees {
    static readonly type = "[App Component] Fetch Employees"
}

export class FetchRolesSuccess {
    static readonly type = '[Role] Fetch All Success';
    constructor(public payload: RoleTreeNode[]) { }
}


export class FetchFlatRolesSuccess {
    static readonly type = '[Role] Fetch Flat Roles Success';
    constructor(public payload: FlatRole[]) { }
}

export class FetchEmployeesSuccess {
    static readonly type = "[Role State] Fetch Employees Success";
    constructor(public payload: Array<EmployeeBulk>) { }
}

export class FetchRolesFail {
    static readonly type = "[Role State] Fetch Roles Failure"
    constructor(public payload: string){}
}

export class FetchEmployeesFail {
    static readonly type = "[Role State] Fetch Employees Failure"
    constructor(public payload: string){}
}

export class FetchFlatRolesFail {
    static readonly type = "[Role State] Fetch Flat Roles Failure"
    constructor(public payload: string){}
}

export class CreateRole {
    static readonly type = "[Task Component] Add Task"
    // constructor(public payload: Task){}
}

export class CreateEmployee {
    static readonly type = "[Task Component] Delete Task"
    constructor(public payload: string) { }
}

export class UpdateRole {
    static readonly type = "[Task Component] Complete Task"
    constructor(public payload: string) { }
}

export class UpdateEmployee {
    static readonly type = "[Task Component] Set Alarm Task"
    constructor(public payload: string) { }
}

export class DeleteRole {
    static readonly type = "[] "
    // construt
}