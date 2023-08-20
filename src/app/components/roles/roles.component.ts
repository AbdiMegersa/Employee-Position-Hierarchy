import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from './data'
import { Store, Select } from '@ngxs/store'
import { RoleState } from '../../state/role.state'
import { Observable, of, throwError } from 'rxjs'
import { RoleTreeNode, RoleDetail } from '../../models/Role'
import { RoleService } from '../../services/role.service'
import { catchError } from 'rxjs/operators'
import { FetchAll, FetchEmployees, FetchFlatRoles } from '../../state/role.actions'
import { RoleCreate, FlatRole, RoleUrl } from '../../models/Role'
import { Employee } from '../../models/Role'
import { phoneValidator } from './phone-validator'
import { NzMessageService } from 'ng-zorro-antd/message';


interface ModalDetail {
  selected: RoleDetail | RoleUrl | null;
  loading: boolean;
  visible: boolean;
  data: any;
  flatData?: FlatRole;
  children?: Array<RoleTreeNode> | null;
  potentialParents?: Array<any>;
  isHead?: boolean;
  processing?: boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})


export class RolesComponent implements OnInit {

  roleForm!: FormGroup;
  employeeForm: FormGroup;
  roleEditForm!: FormGroup;
  deleteForm!: FormGroup;
  mockData = data;
  flatRoles!: Array<FlatRole>;
  scaleClass: number = 0.8;

  @Select(RoleState.getRoles) roles$!: Observable<any[]>;
  @Select(RoleState.getEmployees) employees$!: Observable<any[]>;

  isOkLoading: boolean = false;
  isRoleFormVisible: boolean = false;
  isEmployeeFormVisible: boolean = false;
  selectedNodes: TreeNode[] = [];
  rolesError: string = "";

  isRoleEditLoading: boolean = false
  isAddEmployeeLoading: boolean = false;
  isEditLoading: boolean = false;


  addRoleDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  addEmployeeDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  viewDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  editDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  deleteDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null,
    isHead: false
  }

  // the data for the organization chart!
  data!: TreeNode[];
  chartDetail!: {
    data: TreeNode[] | null;
    loading: boolean;
    error: string;
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private roleService: RoleService,
    private message: NzMessageService,
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.required, phoneValidator()]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      roleId: [null, Validators.required],
    })

    this.deleteForm = this.formBuilder.group({});
  }


  ngOnInit(): void {
    this.chartDetail = {
      data: null,
      loading: true,
      error: ''
    }

    this.store.select(state => state.role).subscribe(data => {
      console.log('HERE IT IS: ', data.roles)
      this.chartDetail.loading = data.loading;
      this.flatRoles = data.flatRoles;
      this.rolesError = data.rolesError;
      if (!this.chartDetail.loading && !this.chartDetail.error) {
        this.chartDetail.data = null
        this.chartDetail.data = data.roles
      } else if (data.error) {
        this.chartDetail.error = data.rolesError
      }
    })
  }

  scaleUp() {
    this.scaleClass = Math.round((this.scaleClass + 0.05) * 100) / 100
    // this.message.info(`${this.scaleClass}`)
  }
  scaleDown() {
    if (this.scaleClass > 0.48) {
      this.scaleClass = Math.round((this.scaleClass - 0.05) * 100) / 100
      // this.scaleClass -=  0.05
      // this.message.info(`${this.scaleClass}`)
    }
  }

  refetchRoles() {
    this.store.dispatch(new FetchAll())
  }

  showRoleAddModal() {
    this.addRoleDetail.visible = true;
    this.isRoleFormVisible = true;
  }

  // handleRoleOk() {
  //   this.roleForm.markAllAsTouched();
  //   this.roleForm.markAsDirty();
  //   // Check if the form is valid
  //   if (this.roleForm.valid) {
  //     // Form is valid, do something with the form values
  //     this.addRoleDetail.loading = true;
  //     this.roleService.createRole(this.roleForm.value).subscribe((res: RoleCreate) => {
  //       console.log(res.name + ' created')
  //       this.store.dispatch([new FetchAll(), new FetchFlatRoles(), new FetchEmployees()])
  //       this.handleRoleCancel()
  //       this.message.success(`Successfully added role ${res.name}`, {
  //         nzDuration: 3000
  //       })
  //     })

  //   } else {
  //     // Form is invalid, show the error tips
  //     for (const i in this.roleForm.controls) {
  //       this.roleForm.controls[i].markAsDirty();
  //       this.roleForm.controls[i].updateValueAndValidity();
  //     }
  //   }
  // }

  // handleRoleCancel() {
  //   this.addRoleDetail = {
  //     visible: false,
  //     loading: false,
  //     selected: null,
  //     data: null
  //   }
  //   this.roleForm.reset()
  // }

  showEmployeeModal() {
    this.roleService.fetchFlatRoles().subscribe(res => {
      this.addEmployeeDetail.data = res
    })
    this.addEmployeeDetail.visible = true;
  }

  handleEmployeeCancel() {
    this.addEmployeeDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null
    }
    this.employeeForm.reset()
  }


  handleEmployeeOk() {
    this.employeeForm.markAllAsTouched();
    this.employeeForm.markAsDirty();
    // Check if the form is valid
    if (this.employeeForm.valid) {
      // Form is valid, do something with the form values
      this.isOkLoading = true;
      this.addEmployeeDetail.loading = true;
      const { firstName, lastName, birthDate, ...employeeInfo } = this.employeeForm.value
      const employee: Employee = {
        fullName: `${firstName} ${lastName}`,
        ...employeeInfo,
        birthDate: birthDate.toISOString(),
        hireDate: new Date().toISOString(),
        photo: "string",
      }

      this.roleService.createEmployee(employee).pipe(
        catchError(Err => {
          this.message.error((Err.error.message), { nzDuration: 6000 });
          this.isOkLoading = false
          return of(null); // Return an Observable
        })
      ).subscribe(
        (res) => {
          if (res) {
            if (res.fullName) console.log(res, ' created');
            this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
            this.isOkLoading = false;
            this.message.success(`Successfully created employee ${res.fullName}`, { nzDuration: 4000 })
            this.handleEmployeeCancel();
          }
        }
      );

    } else {
      // Form is invalid, show the error tips
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
    }
  }

  displayModal(type: string, node: RoleTreeNode) {
    // window.alert(type + ' ' + node.data.title)
    // VIEW_DATA EDIT_DATA DELETE_DATA
    const actionTypes = {
      edit: "EDIT_DATA",
      delete: "DELETE_DATA",
      view: "VIEW_DATA"
    }

    switch (type) {
      case actionTypes.edit: {
        this.showRoleEdit(node);
        break;
      }
      case actionTypes.delete: {
        this.showRoleDelete(node);
        break;
      }
      case actionTypes.view: {
        this.showRoleView(node);
        break;
      }
      default: {
        console.log('invalid');
      }
    }
  }

  showRoleEdit(node: RoleTreeNode) {

    this.editDetail.loading = true
    // this.editDetail.selected = node.data;
    this.editDetail.visible = true
    this.editDetail.data = node.data


    this.roleService.fetchRolesExceptDescendant(node.data.id).subscribe(ppRoles => {
      // this.message.info('Feching potential parents')
      console.log('started Fetchinf potential parents')
      // ppRoles = ppRoles.filter(role => role.id !== node.data.id)
      this.editDetail.potentialParents = ppRoles.filter(role => role.id !== node.data.id)
      console.info('Finished fetching potential parents', ppRoles)
    })
    this.editDetail.loading = false;

  }
  handleRoleEditCancel() {
    this.editDetail = {
      ...this.editDetail,
      selected: null,
      loading: false,
      visible: false,
      data: null,
      processing: false,
    }
    this.editDetail.processing = false;
    this.isRoleEditLoading = false;
  }

  handleRoleEditOk(updateForm: any) {
    // console.log(updateForm.value)
    if (updateForm.valid) {
      this.editDetail.processing = true;
      if (this.editDetail.data) {
        let id = this.editDetail.data.id;
        this.roleService.updateRole(id, updateForm.value).pipe(
          catchError((Err) => {
            this.message.error(Err.error.message)
            return of(null)
          })
        ).subscribe(
          res => {
            if (res) {
              this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
              this.message.success('Successfully updated role ' + res.name)
              this.handleRoleEditCancel();
            } else {
              this.message.error("Role Could not be updated")
            }
          }
        )

      } else {
        // console.log('Some problem in update');
        this.editDetail.processing = false;
      }
    } else {
      this.message.warning('Invalid Form')
    }
  }

  showRoleDelete(node: RoleTreeNode) {
    // this.isRoleDeleteVisible = true;

    // const role = this.flatRoles.find(r => r.id === node.data.id)
    // if (role && role.reportsTo === null && node.children.length > 0) {
    //   this.message.info('This Head Role it can\'t be deleted')
    //   this.deleteDetail.isHead = true;
    // }

    this.deleteDetail = {
      ...this.deleteDetail,
      visible: true,
      data: node.data,
      children: node.children
    }

    // if (this.deleteDetail.children && this.deleteDetail.children.length > 0) {
    //   this.roleService.fetchRolesExceptDescendant(this.deleteDetail.data.id).subscribe(
    //     res => {
    //       this.deleteDetail.potentialParents = res
    //     }
    //   )
    //   this.deleteForm = this.formBuilder.group({
    //     parentId: [null, Validators.required]
    //   })
    // }
  }

  handleRoleDeleteOk(deleteData: any = null) {
    this.deleteDetail.loading = true;
    // fech except descendants if role has a children
    console.log('started deleting role ')
    this.roleService.fetchSingleRole(this.deleteDetail.data.id).subscribe(res => {

      if (res.reportsTo) {

        let newParent;
        if (this.deleteForm.value.parentId) {
          newParent = this.deleteForm.value.parentId
        } else {
          newParent = res.reportsTo.id
        }
        console.log('delete role ' + this.deleteDetail.data.id)
        console.log('delete role parentId ' + newParent)
        console.log(newParent, res.reportsTo.id)

        this.roleService.deleteRole(this.deleteDetail.data.id, newParent).pipe(
          catchError(Err => {
            this.message.error(Err.error.message, { nzDuration: 5500 });
            this.deleteDetail.loading = false;
            return throwError([]);
          })
        ).subscribe(Ok => {
          console.log(res.name + ' deleted');
          this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
          this.message.success('Successfully deleted role ' + res.name, { nzDuration: 3000 });
          this.handleRoleDeleteCancel();
        }, error => {
          // Handle the error here if needed
          this.message.info("Role couldn't be deleted")
        })

        // this.roleService.deleteRole(this.deleteDetail.data.id, newParent).subscribe(ok => {
        //   console.log(res.name + 'deleted')
        //   this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()])
        //   this.message.success('Successfully deleted role ' + res.name, { nzDuration: 3000 });
        //   this.handleRoleDeleteCancel();
        // })
      }
      else this.message.info('could not be deleted', { nzDuration: 4000 })
    })
  }

  handleRoleDeleteCancel() {
    this.deleteDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null,
      isHead: false
    }
  }

  showRoleView(node: RoleTreeNode) {
    // fech thd data from 
    this.viewDetail = {
      ...this.viewDetail,
      visible: true,
      loading: true,
      children: node.children.length > 0 ? node.children : null
    }

    this.viewDetail.data = node.data;
    this.viewDetail.loading = false;

  }
  handleRoleViewCancel() {
    this.viewDetail = {
      selected: null,
      loading: false,
      visible: false,
      data: null
    }
  }
  handleRoleViewOk() {
    this.handleRoleViewCancel();
  }

}
