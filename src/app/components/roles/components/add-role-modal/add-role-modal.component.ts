import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatRole, RoleCreate } from 'src/app/models/Role';
import { RoleService } from 'src/app/services/role.service';
import { FetchAll, FetchEmployees, FetchFlatRoles } from 'src/app/state/role.actions';
import { Select, Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoleState } from 'src/app/state/role.state';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-add-role-modal',
  templateUrl: './add-role-modal.component.html',
  styleUrls: ['./add-role-modal.component.css']
})
export class AddRoleModalComponent implements OnInit {
  @Input() addRoleDetail: any;
  @Output() onCancel = new EventEmitter();
  @Output() onOk = new EventEmitter<any>();

  roleForm!: FormGroup;
  @Select(RoleState.getFlatRoles()) flatRoles$!: Observable<FlatRole[]>

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService, 
    private store: Store,
    private message: NzMessageService
    ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parentId: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.roleService.fetchFlatRoles().subscribe(res => {
      if (res) {
        this.addRoleDetail.data = res
        console.log('data for flat roles ', res)
      }
      else this.addRoleDetail.data = null
    })
  }

  cancelAddRole() {
    // this.onCancel.emit()
    this.addRoleDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null
    }
    this.roleForm.reset()
  }

  addRole() {
    this.roleForm.markAllAsTouched();
    this.roleForm.markAsDirty();
    // Check if the form is valid
    if (this.roleForm.valid) {
      // Form is valid, do something with the form values
      this.addRoleDetail.loading = true;
      this.roleService.createRole(this.roleForm.value).subscribe((res: RoleCreate) => {
        console.log(res.name + ' created')
        this.store.dispatch([new FetchAll(), new FetchFlatRoles(), new FetchEmployees()])
        this.cancelAddRole()
        this.message.success(`Successfully added role ${res.name}`, {
          nzDuration: 3000
        })
      })

    } else {
      // Form is invalid, show the error tips
      for (const i in this.roleForm.controls) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
    }

  }

}
