import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { phoneValidator } from '../../phone-validator';
import { Select, Store } from '@ngxs/store';
import { RoleState } from 'src/app/state/role.state';
import { Observable, catchError, of } from 'rxjs'
import { Employee, FlatRole } from 'src/app/models/Role';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FetchAll, FetchEmployees, FetchFlatRoles } from 'src/app/state/role.actions';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.css']
})
export class AddEmployeeModalComponent implements OnInit {

  @Input() addEmployeeDetail!: any;
  @Output() onCancel = new EventEmitter();

  employeeForm: FormGroup;
  @Select(RoleState.getFlatRoles()) flatRoles$!: Observable<FlatRole[]>;

  constructor(
    private roleService: RoleService, 
    private store: Store,
    private fb: FormBuilder,
    private message: NzMessageService) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.required, phoneValidator()]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      roleId: [null, Validators.required],
    })
  }

  ngOnInit(): void {}

  cancelAddEmployee() {
    this.onCancel.emit()
  }

  onOk() {
    this.employeeForm.markAllAsTouched();
    this.employeeForm.markAsDirty();
    // Check if the form is valid
    if (this.employeeForm.valid) {
      // Form is valid, do something with the form values
      this.addEmployeeDetail.processing = true;
      // this.addEmployeeDetail.loading = true;
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
          this.addEmployeeDetail.processing = false
          return of(null); // Return an Observable
        })
      ).subscribe(
        (res) => {
          if (res) {
            if (res.fullName) console.log(res, ' created');
            this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
            this.addEmployeeDetail.processing = false;
            this.message.success(`Successfully created employee ${res.fullName}`, { nzDuration: 4000 })
            this.cancelAddEmployee();
          }
        }
      );

    } else {
      // Form is invalid, show the error tips
      for (const i in this.employeeForm.controls) {
        this.employeeForm.controls[i].markAsDirty();
        this.employeeForm.controls[i].updateValueAndValidity();
      }
    }
  }

}
