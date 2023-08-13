import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Store } from '@ngxs/store'
import { EmployeeBulk, FlatRole } from '../../models/Role'
import { phoneValidator } from '../roles/phone-validator'
import { RoleService } from 'src/app/services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FetchAll, FetchEmployees, FetchFlatRoles } from 'src/app/state/role.actions';
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators';


interface DataItem {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<EmployeeBulk> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<EmployeeBulk> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {


  // filterFunc: NzTableFilterFn<DataItem>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private roleService: RoleService,
    private message: NzMessageService
  ) {
    this.employeeEditForm = this.fb.group({
      firstName: [],
      lastName: [],
      email: [],
      gender: [],
      phone: [],
      birthDate: [],
      roleId: []
    });
  }

  pageIndex = 1;
  pageSize = 10;
  listOfColumns: ColumnItem[] = [
    {
      name: 'ID',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Name',
      sortOrder: 'ascend',
      sortFn: (a: EmployeeBulk, b: EmployeeBulk) => a.fullName.localeCompare(b.fullName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Email',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Role',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    }
  ];

  listOfData: Array<EmployeeBulk> = [];
  listOfRoles: Array<any> = []
  loadingEmployees: boolean = false;

  employeeEditForm: FormGroup;
  isEmployeeEditFormVisible: boolean = false
  isEmployeeEditLoading: boolean = false;

  isDeleteModalVisible: boolean = false;
  isDeleteLoading: boolean = false;

  selectedDeleteNode!: any;
  flatRoles!: Array<FlatRole>;

  ngOnInit(): void {
    this.store.select(state => state.role).subscribe(state => {
      this.listOfData = state.employees;
      this.listOfRoles = state.arrayRoles;
      this.loadingEmployees = state.loadingEmployees;
      this.flatRoles = state.flatRoles;
    })
  }


  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  showEmployeeEditModal(employee: any) {
    this.isEmployeeEditFormVisible = true;
    let nameArray = employee.fullName.split(" ")
    // console.log(employee.roleId)
    this.employeeEditForm = this.fb.group({
      id: [employee.id],
      firstName: [nameArray[0], Validators.required],
      lastName: [nameArray[1], Validators.required],
      email: [employee.email, Validators.email],
      gender: [employee.gender, Validators.required],
      phone: [employee.phone, [Validators.required]],
      birthDate: [employee.age, Validators.required],
      roleId: [employee.role.id, Validators.required]
    });
  }

  handleEmployeeEditCancel() {
    this.isEmployeeEditFormVisible = false;
    this.isEmployeeEditLoading = false;
    this.employeeEditForm.reset();
  }
  handleEmployeeEditOk() {
    this.isEmployeeEditLoading = true;

    const employeeId = this.employeeEditForm.value.id;
    const em = this.listOfData.find(_e => _e.id === employeeId)

    if (em) {
      let employeeDetails: {
        fullName: string;
        email: string;
        phone: string;
        gender: string;
        birthDate: string;
        hireDate: string;
        roleId: string;
        photo: string;
      } = {
        fullName: `${this.employeeEditForm.value.firstName} ${this.employeeEditForm.value.lastName}`,
        email: this.employeeEditForm.value.email,
        phone: this.employeeEditForm.value.phone,
        gender: this.employeeEditForm.value.gender,
        birthDate: em.birthDate,
        hireDate: em.hireDate,
        roleId: this.employeeEditForm.value.roleId,
        photo: "string",
      }

      this.roleService.updateEmployee(employeeId, employeeDetails).pipe(
        catchError(Err => {
          this.message.error(Err.error.message, { nzDuration: 5000 })
          this.isEmployeeEditLoading = false;
          return of(null)
        })
      ).subscribe(
        res => {
          if (res) {
            this.store.dispatch([new FetchEmployees, new FetchFlatRoles, new FetchAll])
            this.message.success('Successfully Updated employee ' + res.fullName)
          }
        }
      )
    } else {
      alert('somethdi went bad')
    }

  }

  showDeleteModal(data: any) {
    this.selectedDeleteNode = data;
    this.isDeleteModalVisible = true;
  }

  handleDeleteCancel() {
    this.isDeleteLoading = false;
    this.selectedDeleteNode = null;
    this.isDeleteModalVisible = false;
  }
  handleDeleteOk() {
    this.isDeleteLoading = true;
    this.roleService.deleteEmployee(this.selectedDeleteNode.id).pipe(
      catchError(Err => {
        this.message.error(Err.error.message)
        return of(null)
      })
    ).subscribe(() => {
      this.message.success('Successfully deleted employee ' + this.selectedDeleteNode.fullName, { nzDuration: 3500 })
      this.store.dispatch([new FetchEmployees(), new FetchAll(), new FetchFlatRoles()])
      this.handleDeleteCancel()
    }
    )
  }

}
